import { Controller, Get, Req, Res } from 'routing-controllers';
import { Logger, LoggerInterface } from '../../logger';
import { Next } from '../../next-decorator';
@Controller()
export class InstanceController {
  @Next()
  next: any
  @Logger()
  private readonly logger: LoggerInterface;
  @Get('/instances')
  async index(@Req() req, @Res() res) {
    this.logger.debug('Instances!');
    return this.next.render(req, res, '/instances', req.query)
  }
}
