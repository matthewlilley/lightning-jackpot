import { performance } from 'perf_hooks'
import {
  ConnectedSocket,
  EmitOnFail,
  EmitOnSuccess,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from 'socket-controllers'
import { EntityManager, Transaction, TransactionManager } from 'typeorm'
import { Balance } from '../../balances'
import lock from '../../lock'
import { Logger, LoggerInterface } from '../../logger'
import { Bet } from '../../bets'
import { CreateBet } from '../create-bet'
import { Instance } from '../../instances'
import { User } from '../../users'
import { Validator } from '../../validators'
import { multiplier } from '@lightning-jackpot/common'
import { Inject } from 'typedi'
import { RouletteService } from '..'

@SocketController()
export class BetController {
  @Logger()
  private readonly logger: LoggerInterface

  @Validator()
  private readonly validator

  @Inject()
  private readonly roulette: RouletteService

  @EmitOnSuccess('betSuccess')
  @EmitOnFail('betError')
  @OnMessage('bet')
  @Transaction()
  async save(
    @ConnectedSocket() socket: any,
    @MessageBody() bet: CreateBet,
    @SocketIO() io: any,
    @TransactionManager() manager: EntityManager
  ) {
    this.logger.debug('Bet!', bet)
    const start = performance.now()
    const unlock = await lock(socket.user.id)
    try {
      const errors = await this.validator.validate(bet)

      if (errors.length > 0) {
        this.logger.debug('Bet validation errors', errors)
        throw new Error('Bet validation errors')
      }

      const user = await manager.findOneOrFail(User, socket.user.id, {
        select: ['id', 'name', 'avatar', 'color'],
        relations: ['balance'],
      })

      const instance = await manager.findOneOrFail(Instance, {
        select: ['id', 'value', 'state'],
        order: { id: 'DESC' },
      })

      if (instance.spinning()) {
        throw new Error('Instance already started!')
      }

      const { total } = await manager
        .createQueryBuilder(Bet, 'bet')
        .select('SUM(bet.value)', 'total')
        .where('bet.instanceId = :instanceId', { instanceId: instance.id })
        .andWhere('bet.userId = :userId', { userId: user.id })
        .andWhere(`JSON_EXTRACT(state, '$.type')='${bet.state.type}'`)
        .getRawOne()

      const balance = await this.roulette.balance()

      // const balance = await manager.findOneOrFail(Balance, {
      //   where: { gameId: 1 },
      // })

      const max = Math.floor(balance.value * 0.01)

      this.logger.debug('max', max)

      const potential = Number(total) * multiplier(bet.state.type)

      this.logger.debug('potential', potential)

      const remaining = max - potential

      this.logger.debug('remaining', remaining)

      const difference = remaining - bet.value * multiplier(bet.state.type)

      this.logger.debug('difference', difference)

      if (difference < 0 && remaining < 1000) {
        this.logger.debug(
          'difference less than zero, and remaining less than 1000.'
        )
        this.logger.debug('difference', difference)
        throw new Error(
          `You've reached the maximum bet limit for "${bet.state.type}", you'll need to wait to place more bets.`
        )
      }

      if (difference < 0 && remaining > 1000) {
        this.logger.debug(
          'difference less than zero, and remaining is more than 1000.'
        )
        this.logger.debug(
          'difference / multiplier',
          Math.floor(difference / multiplier(bet.state.type))
        )
        this.logger.debug(
          'remaining / multiplier',
          Math.floor(remaining / multiplier(bet.state.type))
        )
        bet.value = Math.floor(remaining / multiplier(bet.state.type))
        // socket.emit(
        //   'info',
        //   `Accepting your request bet value on "${
        //     bet.state.type
        //   }" would've surpassed the maximum bet limit, so the value was reduced to ${
        //     bet.value
        //   }, and that was accepted for your bet.`,
        // );
      }

      const nextPotential =
        (Number(total) + bet.value) * multiplier(bet.state.type)
      this.logger.debug('nextPotential', nextPotential)
      this.logger.debug('max', max)
      this.logger.debug(bet.value > user.balance.value, nextPotential > max)

      if (bet.value > user.balance.value) {
        throw new Error('Balance is too low')
      }

      if (nextPotential > max) {
        throw new Error('Bet limit reached')
      }

      this.logger.info('Save bet')

      await manager.save(
        manager.create(Bet, {
          ...bet,
          user,
          instance,
        })
      )

      socket.broadcast.emit('betCreated', {
        ...bet,
        user: {
          avatar: user.avatar,
          color: user.color,
          id: user.id,
          name: user.name,
        },
      })

      this.logger.debug('Before return bet on success...')
      return {
        ...bet,
        user: {
          avatar: user.avatar,
          color: user.color,
          id: user.id,
          name: user.name,
        },
      }
    } catch (error) {
      this.logger.error('Bet error', error)
      throw error
    } finally {
      unlock()
      const end = performance.now()
      this.logger.debug(`Bet process took ${end - start} milliseconds.`)
    }
  }
}
