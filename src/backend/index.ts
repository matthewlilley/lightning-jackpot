import {
  Connection,
  createConnection,
  useContainer as ormUseContainer,
} from 'typeorm'
import pmx, { Entrypoint } from '@pm2/io'

import { Container } from 'typedi'
import LightningJackpot from './lightning-jackpot'
import { Sanitizer } from 'class-sanitizer'
import { useContainer as classValidatorUseContainer } from 'class-validator'
import { getDatabaseConfig } from './config'
import logger from './logger'
import { useContainer as routingUseContainer } from 'routing-controllers'
import { useContainer as socketUseContainer } from 'socket-controllers'

ormUseContainer(Container)
routingUseContainer(Container)
socketUseContainer(Container)
classValidatorUseContainer(Container)
const sanitizer: Sanitizer = Container.get(Sanitizer)
sanitizer.container = Container

new (class extends Entrypoint {
  // This is the very first method called on startup
  private connection: Connection
  async onStart(callback: (error?: Error) => void) {
    try {
      logger.info('App start')
      const config = await getDatabaseConfig()
      await createConnection(config)
      const app = Container.get(LightningJackpot)
      await app.bootstrap()
      logger.info('App bootstraped')
      callback()
    } catch (error) {
      callback(error)
    }
  }

  // This is the very last method called on exit || uncaught exception
  async onStop(
    error: Error,
    callback: () => void,
    code: number,
    signal: string
  ) {
    logger.error('App has exited', { error, callback, code, signal })
    callback()
  }

  // Here we declare some process metrics
  sensors() {
    //
  }

  // Here are some actions to interact with the app in live
  actuators() {
    pmx.action('lightning-jackpot:start', callback => {
      callback({ success: true })
    })
    pmx.action('lightning-jackpot:stop', callback => {
      callback({ success: true })
    })
    pmx.action('lightning-jackpot:restart', callback => {
      callback({ success: true })
    })
    pmx.action('lightning-jackpot:pause', callback => {
      callback({ success: true })
    })
    // pmx.action('lightning-jackpot:check-transaction', function(reply) {
    //   shelljs.exec('pm2 link info', function(err, stdo, stde) {
    //     reply({ err, stdo, stde });
    //   });
    // });
    pmx.action(
      'lightning-jackpot:check-transaction',
      (paymentRequest: string, reply) => {
        logger.debug('check-transaction', paymentRequest)
        reply({ success: true })
      }
    )

    pmx.action(
      'lightning-jackpot:settle-transaction',
      (paymentRequest: string, reply) => {
        logger.debug('settle-transaction', paymentRequest)
        reply({ success: true })
      }
    )

    pmx.action('lightning-jackpot:env', reply => {
      reply(process.env)
    })
  }
})()
