import { Job } from 'bull'
import logger from '../../logger'
import mail from '../../mail'

export default function(job: Job) {
  logger.info('Email process')
  return mail.sendMail(job.data)
}
