import { Transport } from 'nodemailer'
import {
  Authorized,
  Body,
  Get,
  JsonController,
  Post,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers'
import { Logger, LoggerInterface } from '../../../logger'
import { emailQueue } from '../../../queues'
import Message from '../../message'

@JsonController()
export class ContactController {
  @Logger()
  private readonly logger: LoggerInterface

  @Authorized()
  @Post('/api/v0/contact')
  async contact(@Body() message: Message, @Req() req, @Res() res) {
    this.logger.debug('Contact', message)
    const data = {
      ...message,
      to: 'hello@matthewlilley.com',
      from: `${res.locals.user.name ||
        res.locals.user.id} <no-reply@lightningjackpot.com>`,
    }
    this.logger.debug('Contact data', data)
    emailQueue.add('sendEmail', data)
    res.sendStatus(200)
  }
}
