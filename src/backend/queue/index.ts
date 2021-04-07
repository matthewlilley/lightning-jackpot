import { emailQueue, invoiceQueue } from '../queues'

import { Entrypoint } from '@pm2/io'
import { createConnection } from 'typeorm'
import { getDatabaseConfig } from '../config'
import logger from '../logger'

new (class Queue extends Entrypoint {
  async onStart(callback: (error?: Error) => void) {
    try {
      logger.info('Queue onStart')

      await createConnection({
        ...(await getDatabaseConfig()),
      })

      logger.info('Databse connection established for queue, initialising...')

      // Email
      // Max concurrency for sendEmail is 25
      emailQueue.process('sendEmail', 25, `${__dirname}/processors/email.js`)

      // Invoice
      // Max concurrency for invoicePaid is 25
      invoiceQueue.process(
        'invoicePaid',
        25,
        `${__dirname}/processors/invoice.js`
      )

      callback()
    } catch (error) {
      logger.error('Queue onStart error')
      callback(error)
    }
  }

  onStop(error: Error, callback: () => void, code: number, signal: string) {
    logger.info(
      'Queue onStop',
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
})()
