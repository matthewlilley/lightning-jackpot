/* eslint require-atomic-updates: 0 */

import { Logger, LoggerInterface } from '../../logger'
import { Middleware, MiddlewareInterface } from 'socket-controllers'
import { User, UserRepository } from '../../users'

import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Socket } from 'socket.io'

@Middleware()
export class ProvidesUser implements MiddlewareInterface {
  @Logger()
  private readonly logger: LoggerInterface
  @InjectRepository(User)
  private readonly users: UserRepository
  async use(socket: any, next: (err?: any) => any) {
    try {
      if (
        socket.handshake.session &&
        socket.handshake.session.passport &&
        socket.handshake.session.passport.user
      ) { 
        socket.user = await this.users.findById(
          socket.handshake.session.passport.user
        )
      }
    } catch (error) {
      this.logger.error(error)
      next(error)
    }
    next()
  }
}
