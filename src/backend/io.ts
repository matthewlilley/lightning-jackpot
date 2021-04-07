import createSocketIo, { Server as SocketIoServer } from 'socket.io'
import { ioRedisConfig, socketControllersConfig } from './config'
import socketIoRedis, { RedisAdapter } from 'socket.io-redis'

import { Server as HttpServer } from 'http'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import Redis from 'ioredis'
import { RequestHandler } from 'express'
import { groupBy } from 'lodash'
import logger from './logger'
import sharedSession from 'express-socket.io-session'
import { useSocketServer } from 'socket-controllers'

export default io => {
  // const io: any = createSocketIo(server);

  const pubClient = new Redis(ioRedisConfig)

  const subClient = new Redis(ioRedisConfig)

  const redisAdapter = socketIoRedis({
    pubClient,
    subClient,
  })

  io.adapter(redisAdapter)

  redisAdapter.pubClient.on('error', error => {
    logger.error('pubClient error', error)
  })

  redisAdapter.subClient.on('error', error => {
    logger.error('subClient error', error)
  })

  io.of('/').adapter.on('error', error => {
    logger.error('io.of(/).adapter error', error)
  })

  // Debugging io
  io.use((socket, next) => {
    logger.debug(
      'socket.handshake session data is %j.',
      socket.handshake.session
    )
    next()
  })

  const rateLimiter = new RateLimiterRedis({
    storeClient: new Redis(ioRedisConfig),
    points: 10, // Number of points
    duration: 1, // Per second
  })

  io.on('connection', (socket: any) => {
    socket.use(async (packet, next) => {
      try {
        await rateLimiter.consume(socket.handshake.address) // consume 1 point per event from IP
        const [event] = packet
        if (
          (socket.handshake.session.passport &&
            socket.handshake.session.passport.user &&
            [
              'deposit',
              'withdraw',
              'bet',
              'name',
              'avatar',
              'color',
              'tip',
            ].includes(event)) ||
          event === 'global'
        ) {
          logger.debug('NEXT...')
          next()
        } else {
          next(new Error('Unauthorised!'))
        }
      } catch (error) {
        logger.error('io error', error)
        if (error.msBeforeNext) {
          logger.info('Blocked', error.msBeforeNext)
          socket.emit('blocked', { event, 'retry-ms': error.msBeforeNext })
          next(new Error('Too many requests!'))
        }
      }
    })

    socket.emit('ready', Date.now())

    // redisClient.set(
    //   'online',
    //   Object.keys(
    //     groupBy(io.sockets.sockets, 'handshake.session.passwordless'),
    //   ).length.toString(),
    // );

    // setInterval(() => {
    //   io.of('/').adapter.clients((error, clients) => {
    //     logger.debug('Online:', clients); // an array containing all connected socket ids
    //     redisClient.set('online', clients.length.toString());
    //     io.emit('online', clients.length);
    //   });
    // }, 60000);

    // logger.debug('Handshake: ', socket.handshake);
    logger.debug(
      `New socket client connected (id=${socket.id}, userId=${
        socket.handshake.session.passport
          ? socket.handshake.session.passport
          : 'undefined'
      }, address=${socket.handshake.address}).`
    )

    // socket.broadcast.emit('hello', {remoteAddress: socket.handshake.address});

    socket.on('disconnect', () => {
      logger.debug(
        `Client disconnected (id=${socket.id}, userId=${
          socket.handshake.session.passport
            ? socket.handshake.session.passport
            : 'undefined'
        }).`
      )
      // redisClient.set(
      //   'online',
      //   Object.keys(
      //     groupBy(io.sockets.sockets, 'handshake.session.passwordless'),
      //   ).length.toString(),
      // );
    })
  })

  function tipCreated(data) {
    logger.info('tipCreated!', data)
    const { tip } = data
    Object.values(io.sockets.sockets).forEach((socket: any) => {
      if (socket.user.id === tip.recipientId) {
        socket.emit('tipRecieved', tip)
      }
    })
  }

  function transactionUpdated(data) {
    logger.info('transactionUpdated!')
    const { transaction } = data
    Object.values(io.sockets.sockets).forEach((socket: any) => {
      if (socket.user.id === transaction.userId) {
        socket.emit('transactionUpdated', transaction)
      }
    })
  }

  io.of('/').adapter.customHook = data => {
    const { event } = data
    switch (event) {
      case 'transactionUpdated':
        transactionUpdated(data)
        break

      case 'tipCreated':
        tipCreated(data)
        break

      default:
        break
    }
  }

  useSocketServer(io, socketControllersConfig)

  return io
}
