import {
  Authorized,
  Controller,
  Get,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers'
import { NextRequestHandler } from '../../next-decorator'
import { parse } from 'url'

@Controller('/admin')
export class AdminController {
  @NextRequestHandler()
  private readonly handle: (req, res, query) => Promise<void>
  @Get('*')
  @Authorized(['admin'])
  index(@Req() req, @Res() res) {
    return this.handle(req, res, parse(req.url, true))
  }
}
