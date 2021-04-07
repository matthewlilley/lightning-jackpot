import { Transaction, TransactionStatus } from '../../transactions'
import { createConnection, getConnection, getConnectionManager } from 'typeorm'
import { getDatabaseConfig, ioRedisConfig } from '../../config'

import { Job } from 'bull'
import RedisStatic from 'ioredis'
import createSocketIo from 'socket.io'
import logger from '../../logger'
import socketIoRedis from 'socket.io-redis'

const io: any = createSocketIo()

const pubClient = new RedisStatic(ioRedisConfig)

const subClient = new RedisStatic(ioRedisConfig)

const redisAdapter = socketIoRedis({
  pubClient,
  subClient,
})

io.adapter(redisAdapter)

export default async function(job: Job) {
  logger.info('Invoice process')

  const invoice = job.data

  const connectionManager = getConnectionManager()

  const connection = connectionManager.has('transaction')
    ? connectionManager.get('transaction')
    : connectionManager.create({
        ...(await getDatabaseConfig()),
        name: 'transaction',
      })

  !connection.isConnected && (await connection.connect())

  return connection.transaction(async manager => {
    const transaction = await manager.findOneOrFail(Transaction, {
      relations: ['user', 'user.balance'],
      where: {
        paymentRequest: invoice.paymentRequest,
      },
    })

    await manager.save(Transaction, {
      ...transaction,
      status: TransactionStatus.Confirmed,
    })

    io.of('/').adapter.customRequest({
      event: 'transactionUpdated',
      transaction: {
        ...transaction,
        status: TransactionStatus.Confirmed,
      },
    })
  })
}
