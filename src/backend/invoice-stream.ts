import { ClientReadableStream, ServiceError } from 'grpc'
import { Invoice, InvoiceSubscription, createLightning } from 'lightning-rpc'

import { Entrypoint } from '@pm2/io'
import { invoiceQueue } from './queues'
import { lightningRpcConfig } from './config'
import logger from './logger'

let lightning = createLightning({
  ...lightningRpcConfig,
  options: {
    // use own pool instead of sharing with next clients
    'grpc.use_local_subchannel_pool': 1,

    // After a duration of this time the client/server pings its peer to see if the transport is still alive. Default 2 hours.
    'grpc.keepalive_time_ms': 60000 * 5,
    // After waiting for a duration of this time, if the keepalive ping sender does not receive the ping ack, it will close the transport. Default 20 seconds.
    'grpc.keepalive_timeout_ms': 5000,
    // Is it permissible to send keepalive pings without any outstanding streams.
    'grpc.keepalive_permit_without_calls': 0,

    // How many pings can we send before needing to send a data frame or header frame? (0 indicates that an infinite number of pings can be sent without sending a data frame or header frame)
    'grpc.http2.max_pings_without_data': 0,
    // Minimum time between sending successive ping frames without receiving any data frame, Int valued, milliseconds.
    'grpc.http2.min_time_between_pings_ms': 60000,
    // Minimum allowed time between a server receiving successive ping frames without sending any data frame.
    'grpc.http2.min_ping_interval_without_data_ms': 30000,

    // // Maximum time that a channel may have no outstanding rpcs. Int valued,
    // // milliseconds. INT_MAX means unlimited.
    // 'grpc.max_connection_idle_ms':
    // // Maximum time that a channel may exist. Int valued, milliseconds.
    // // INT_MAX means unlimited.
    // 'grpc.max_connection_age_ms',
  },
})

let invoiceStream: ClientReadableStream<Invoice>

const invoiceHandler = async (invoice: Invoice) => {
  try {
    if (!invoice.getSettled()) {
      logger.info(`Unpaid invoice: ${JSON.stringify(invoice)}`)
    } else {
      logger.info(`Invoice paid: ${JSON.stringify(invoice)}`)

      invoiceQueue.add('invoicePaid', invoice.toObject())
    }
  } catch (error) {
    logger.error(error)
  }
}

function subscribeInvoices() {
  lightning.waitForReady(Infinity, (error: Error | null) => {
    if (error) {
      logger.error('Lightning wait for ready error', error)
    }
    logger.debug('Lightning ready')

    invoiceStream = lightning.subscribeInvoices(new InvoiceSubscription())

    invoiceStream.on('data', invoiceHandler)
    // this.invoiceStream.on('data', invoice => {
    //   this.logger.debug('Invoice: ----------->>>', invoice);
    // });

    invoiceStream.on('end', () => {
      // The server has finished sending
      logger.debug('Invoice Stream End 🔚🔚🔚')
      subscribeInvoices()
    })

    invoiceStream.on('status', status => {
      // process status
      logger.debug(`Invoice Stream Status: ${JSON.stringify(status)}`)
    })

    invoiceStream.on('error', (serviceError: ServiceError) => {
      // An error has occurred and the stream has been closed.
      logger.error(`Invoice Stream Error: ❌❌❌ ${serviceError}`)

      if (serviceError.code === 12 || serviceError.code === 2) {
        if (serviceError.code === 12) {
          logger.error(
            'Unimplimented error, someone probably called the client while it was down, recreate it.'
            // lightning,
          )
        }
        if (serviceError.code === 2) {
          logger.error(
            'Stream removed error, the server probably went down, recreate the client.'
            // lightning,
          )
        }
        lightning.close()
        lightning = createLightning(lightningRpcConfig)
      }

      setTimeout(() => {
        subscribeInvoices()
      }, 1000)
    })
  })
}

class InvoiceStream extends Entrypoint {
  async onStart(callback: (error?: Error) => void) {
    try {
      logger.info('Invoice stream onStart')
      subscribeInvoices()
      callback()
    } catch (error) {
      logger.error('Invoice stream onStart Error', error)
      callback(error)
    }
  }

  async onStop(
    error: Error,
    callback: () => void,
    code: number,
    signal: string
  ) {
    logger.info(
      'Invoice stream onStop',
      JSON.stringify({ error, callback, code, signal })
    )
    callback()
  }

  // Here we declare some process metrics
  sensors() {
    //
  }

  // Here are some actions to interact with the app in live
  actuators() {
    //
  }
}

new InvoiceStream()
