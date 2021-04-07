import {
  ConnectedSocket,
  EmitOnFail,
  EmitOnSuccess,
  MessageBody,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
  SocketIO,
} from 'socket-controllers'
import { EntityManager, Transaction, TransactionManager } from 'typeorm'
import { Logger, LoggerInterface } from '../../logger'
import { Server, Socket } from 'socket.io'

import { Container } from 'typedi'
import { MessageRepository } from '../../messages'
import { Sanitizer } from 'class-sanitizer'
import { Inject } from 'typedi'
import { Tip } from '../../tips'
import { User } from '../../users'
import { Validator } from 'class-validator'
import lock from '../../lock'
import moment from 'moment'

@SocketController()
export class TipController {
  @Logger()
  private readonly logger: LoggerInterface

  @Inject()
  private readonly validator: Validator

  @Inject()
  private readonly messages: MessageRepository

  @OnMessage('tip')
  @EmitOnSuccess('tipSuccess')
  @EmitOnFail('tipFailed')
  @Transaction()
  async save(
    @ConnectedSocket() socket: any,
    @MessageBody() tip: Tip,
    @SocketIO() io: any,
    @TransactionManager() manager: EntityManager
  ) {
    this.logger.debug('tip', tip)

    const unlock = await lock(socket.user.id)

    try {
      const errors = await this.validator.validate(tip)

      if (errors.length > 0) {
        this.logger.debug('Tip validation errors', errors, tip)
        throw new Error('Check tip inputs!')
      }

      const tipper = await manager.findOneOrFail(User, socket.user.id, {
        relations: ['balance'],
      })

      if (tipper.name === tip.recipient.name) {
        throw new Error('Cannot tip yourself!')
      }

      const recipient = await manager.findOne(User, {
        relations: ['balance'],
        where: { name: tip.recipient.name },
      })

      if (!recipient) {
        throw new Error('Unknown tip recipient.')
      }

      const value = Number(tip.value)

      const fee = Math.floor(value * Number(process.env.TIP_FEE))

      const valuePlusFee = value + fee

      if (tipper.balance.value - valuePlusFee >= 0) {
        await manager.save(
          manager.create(Tip, {
            ...tip,
            tipper,
            recipient,
            value,
            fee,
          })
        )

        const message = await this.messages.create({
          id: moment().unix(),
          tags: [
            // {
            //   color: 'purple',
            //   text: 'SYSTEM',
            // },
            {
              color: 'blue',
              text: 'TIP',
            },
          ],
          value: `${
            tipper.name
          } launched a tip of ${tip.value.toLocaleString()} satoshi to ${
            recipient.name
          }`,
        })

        io.emit('global', message)

        io.of('/').adapter.customRequest({
          event: 'tipCreated',
          tip,
        })
      }
      return {
        value: tip.value,
        message: `Successfully sent tip of ${tip.value.toLocaleString()} SAT to ${
          recipient.name
        }.`,
      }
    } catch (error) {
      this.logger.error('TipController error', error)
      throw error
    } finally {
      this.logger.info('Unlock...')
      unlock()
    }
  }
}
