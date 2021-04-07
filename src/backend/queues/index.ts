import Queue from 'bull'
import logger from '../logger'
import { ioRedisConfig as redis } from '../config'

// Email
export const emailQueue = new Queue('email', { redis })
emailQueue.on('completed', (job, result) => {
  logger.debug(`Email Job completed with result ${result}`)
})
emailQueue.on('error', error => {
  logger.error(`Email Job error ${JSON.stringify(error)}`)
})

// Invoice
export const invoiceQueue = new Queue('invoice', { redis })
invoiceQueue.on('completed', (job, result) => {
  logger.debug('Invoice Job completed', job, result)
})
invoiceQueue.on('error', error => {
  logger.error(`Invoice Job error ${JSON.stringify(error)}`)
})
