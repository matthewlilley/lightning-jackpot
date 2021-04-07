import { NextFunction, Request, Response } from 'express'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Logger, LoggerInterface } from '../../logger'
import { User, UserRepository } from '../../users'

@Middleware({ type: 'before' })
export class ProvidesUser implements ExpressMiddlewareInterface {
  @Logger()
  private readonly logger: LoggerInterface
  @InjectRepository(User)
  private readonly users: UserRepository
  async use(req: Request | any, res: Response, next: NextFunction) {
    if (req.user) {
      // this.logger.debug('HTTP Provides User Middleware', req.user)
      // const user = await this.users.findById(req.user);
      // res.locals.user = user;
      res.locals.user = req.user
    }
    next()
  }
}
