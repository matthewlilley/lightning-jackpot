import {
  AddInvoiceResponse,
  Invoice,
  PayReq,
  PayReqString,
  SendRequest,
  SendResponse,
  createLightning,
} from 'lightning-rpc'
import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from 'socket-controllers'
import {
  EntityManager,
  Transaction as OrmTransaction,
  TransactionManager,
} from 'typeorm'
import { lightningRpcConfig } from '../../config'
import lock from '../../lock'
import { Logger, LoggerInterface } from '../../logger'
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../transactions'
import { User } from '../../users'

@SocketController()
export class TransactionController {
  @Logger()
  private readonly logger: LoggerInterface

  private readonly lightning = createLightning({
    ...lightningRpcConfig,
    options: {
      // After a duration of this time the client/server pings its peer to see if the transport is still alive. Default 2 hours.
      'grpc.keepalive_time_ms': 60000 * 5,
      // After waiting for a duration of this time, if the keepalive ping sender does not receive the ping ack, it will close the transport. Default 20 seconds.
      'grpc.keepalive_timeout_ms': 5000,
      // Is it permissible to send keepalive pings without any outstanding streams.
      'grpc.keepalive_permit_without_calls': 1,
      // How many pings can we send before needing to send a data frame or header frame? (0 indicates that an infinite number of pings can be sent without sending a data frame or header frame)
      'grpc.http2.max_pings_without_data': 0,
      // Minimum time between sending successive ping frames without receiving any data frame, Int valued, milliseconds.
      'grpc.http2.min_time_between_pings_ms': 60000,
      // Minimum allowed time between a server receiving successive ping frames without sending any data frame.
      'grpc.http2.min_ping_interval_without_data_ms': 30000,
    },
  })

  async addInvoice(invoice: Invoice): Promise<AddInvoiceResponse> {
    return new Promise((resolve, reject) => {
      this.lightning.addInvoice(invoice, (error, response) => {
        if (error) {
          reject(error)
        }
        resolve(response)
      })
    })
  }

  async decodePayReq(request: PayReqString): Promise<PayReq> {
    return new Promise((resolve, reject) => {
      this.lightning.decodePayReq(request, (error, response) => {
        if (error) {
          reject(error)
        }
        resolve(response)
      })
    })
  }

  async sendPayment(request: SendRequest): Promise<SendResponse> {
    return new Promise((resolve, reject) => {
      this.lightning.sendPaymentSync(request, async (error, response) => {
        if (error) {
          reject(error)
        }
        resolve(response)
      })
    })
  }

  @OrmTransaction()
  @OnMessage('deposit')
  async deposit(
    @ConnectedSocket() socket,
    @MessageBody() value: number,
    @TransactionManager() manager: EntityManager
  ) {
    this.logger.debug('Deposit', socket.user.id)
    const unlock = await lock(socket.user.id)
    try {
      const user = await manager.findOneOrFail(User, socket.user.id, {
        relations: ['balance'],
      })

      // create the invoice
      const invoice = new Invoice()
      invoice.setMemo('Deposit - LightningJackpot.com')
      invoice.setValue(value)
      invoice.setExpiry(600)

      const response = await this.addInvoice(invoice)

      this.logger.debug('invoice response', response.getPaymentRequest())
      const deposit = manager.create(Transaction, {
        type: TransactionType.Deposit,
        value,
        paymentRequest: response.getPaymentRequest(),
        user,
        status: TransactionStatus.Pending,
      })
      await manager.save(deposit)
      socket.emit('transactionCreated', deposit)
    } catch (error) {
      this.logger.error('Deposit error', error)
      socket.emit('depositFailed', 'Deposit error!')
    } finally {
      unlock()
    }
  }

  @OrmTransaction()
  @OnMessage('withdraw')
  async withdraw(
    @ConnectedSocket() socket,
    @MessageBody() paymentRequest: string,
    @SocketIO() io,
    @TransactionManager() manager: EntityManager
  ) {
    const unlock = await lock(socket.user.id)
    try {
      this.logger.debug('Withdraw!')
      if (
        await manager.findOne(Transaction, {
          where: { paymentRequest },
        })
      ) {
        throw new Error('Transaction has already been paid!')
      }

      this.logger.debug(
        'No transaction with this payment request found, continuing.'
      )

      const payReqString = new PayReqString()
      payReqString.setPayReq(paymentRequest)

      this.logger.debug('payment request', paymentRequest)

      const decodedPaymentRequest = await this.decodePayReq(payReqString)

      this.logger.info('decodedPaymentRequest', decodedPaymentRequest)

      const user = await manager.findOneOrFail(User, socket.user.id, {
        relations: ['balance'],
      })
      this.logger.info('user', user)

      const value = decodedPaymentRequest.getNumSatoshis()
      this.logger.info('value', value)

      this.logger.debug(
        'Check if use has enough balance...',
        value,
        user.balance.value
      )

      if (value > user.balance.value) {
        throw new Error('Not enough funds!')
      }

      const sendRequest = new SendRequest()
      sendRequest.setPaymentRequest(paymentRequest)
      sendRequest.setAmt(value)

      this.logger.debug('Send the payment...')
      const sendResponse = await this.sendPayment(sendRequest)

      this.logger.debug('sendResponse', sendResponse)
      if (sendResponse.getPaymentError()) {
        this.logger.error(
          'sendResponse paymentError',
          sendResponse.getPaymentError()
        )
        throw new Error(sendResponse.getPaymentError())
      }

      const transaction = manager.create(Transaction, {
        type: TransactionType.Withdrawal,
        value,
        paymentRequest,
        user,
        status: TransactionStatus.Confirmed,
      })
      await manager.save(transaction)
      socket.emit('transactionUpdated', transaction)

      this.logger.debug('Withdrawal complete')
    } catch (error) {
      this.logger.error('Withdrawal error', error.message)
      socket.emit('withdrawalFailed', 'Withdraw error!')
    } finally {
      unlock()
    }
  }
}
