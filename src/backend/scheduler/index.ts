import { Entrypoint } from '@pm2/io'
import { createConnection } from 'typeorm'
import { exchangeRate } from '../jobs/exchange-rate'
import { getDatabaseConfig } from '../config'
import { kpi } from '../jobs/kpi'
import logger from '../logger'
import { report } from '../jobs/reports'
import { scheduleJob } from 'node-schedule'
import { seed } from '../jobs/seed'

new (class extends Entrypoint {
  async onStart(callback: (error?: Error) => void) {
    try {
      logger.info('Scheduler onStart')

      await createConnection({
        ...(await getDatabaseConfig()),
      })

      logger.info(
        'Databse connection established for scheduler, scheduling jobs...'
      )

      // day
      scheduleJob('0 0 * * *', async fireDate => {
        try {
          await seed()
          await report('day')
          await kpi()
          await exchangeRate()
        } catch (error) {
          logger.error('Error running daily schedule')
        } finally {
          logger.debug(
            'This job was supposed to run at ' +
              fireDate +
              ', but actually ran at ' +
              new Date()
          )
        }
      })

      // minuite
      scheduleJob('* * * * *', async fireDate => {
        report('minuite')
        // await kpi();
        logger.debug(
          'This job was supposed to run at ' +
            fireDate +
            ', but actually ran at ' +
            new Date()
        )
      })

      // hour
      scheduleJob('0 * * * *', async fireDate => {
        report('hour')
        logger.debug(
          'This job was supposed to run at ' +
            fireDate +
            ', but actually ran at ' +
            new Date()
        )
      })

      callback()
    } catch (error) {
      logger.error('Scheduler onStart error')
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
      'Scheduler onStop',
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
