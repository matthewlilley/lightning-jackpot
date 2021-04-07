import { Controller, Get, Req, Res } from 'routing-controllers'
import { Logger, LoggerInterface } from '../../logger'

@Controller()
export class AuthController {
  @Logger()
  private readonly logger: LoggerInterface
  @Get('/logout')
  async logout(@Req() req, @Res() res) {
    this.logger.debug('Logout!')
    req.logout()
    res.clearCookie('lnjp.sid').redirect('/')
  }
}
