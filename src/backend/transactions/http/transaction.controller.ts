import {
  Authorized,
  Controller,
  Get,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers'
import { Logger, LoggerInterface } from '../../logger'
import { Next } from '../../next-decorator'

@Controller()
export class TransactionController {
  @Next()
  next: any
  @Logger()
  private readonly logger: LoggerInterface
  @Authorized()
  @Get('/transactions')
  async index(@Req() req, @Res() res) {
    this.logger.debug('Transactions!')
    return this.next.render(req, res, '/transactions', req.query)
  }
}
