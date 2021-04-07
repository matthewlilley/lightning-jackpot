import { Credit, Debit } from '../accounting'
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm'

import { Balance } from '../balances'
import { Bet } from '.'
import { Game } from '../games'
import { Instance } from '../instances'
import { Jackpot } from '../jackpots'
import { User } from '../users'
import logger from '../logger'

@EventSubscriber()
export class BetSubscriber implements EntitySubscriberInterface<Bet> {
  /**
   * Indicates that this subscriber only listen to Bet events.
   */
  listenTo() {
    return Bet
  }
  /**
   * Called before entity insertion.
   */
  async beforeInsert(event: InsertEvent<Bet>) {
    logger.info(`START BEFORE BET ENTITY INSERTED: `, event.entity)

    const bet = event.entity

    const user = await event.manager.findOneOrFail(User, bet.userId, {
      relations: ['balance'],
    })

    await event.manager.save(Debit, {
      value: bet.value,
      balanceId: user.balanceId,
      context: 'roulette bet',
    })

    logger.info(`Reduce user balance `, user)
    // Reduce user balance
    await event.manager.decrement(
      Balance,
      { id: user.balanceId },
      'value',
      bet.value
    )

    // Add value to the instance
    logger.info('Increment instance value')
    await event.manager.increment(
      Instance,
      {
        id: bet.instanceId,
      },
      'value',
      bet.value
    )

    // Add a cut to the jackpot
    const jackpot = await event.manager.findOneOrFail(Jackpot, {
      order: { id: 'DESC' },
    })

    logger.info('Increment jackpot value')
    await event.manager.increment(
      Jackpot,
      { id: jackpot.id },
      'value',
      bet.value * Number(process.env.ROULETTE_JACKPOT_CUT)
    )

    logger.info(`END BEFORE BET ENTITY INSERTED`)
  }

  /**
   * Called before entity insertion.
   */
  async beforeUpdate(event: UpdateEvent<Bet>) {
    logger.info(`BEFORE BET ENTITY UPDATED: `, event.entity)

    const bet = event.entity

    const game = await event.manager.findOneOrFail(Game, {
      where: { name: 'roulette ' },
    })

    if (Math.sign(bet.outcome) === 1) {
      const user = await event.manager.findOneOrFail(User, bet.userId, {
        relations: ['balance'],
      })
      await event.manager.save(Credit, {
        value: bet.outcome,
        balanceId: user.balanceId,
        context: 'roulette bet win',
      })

      await event.manager.increment(
        Balance,
        { id: user.balanceId },
        'value',
        bet.outcome
      )

      await event.manager.save(Debit, {
        value: bet.outcome,
        balanceId: game.balanceId,
        context: 'roulette house loss',
      })

      await event.manager.decrement(
        Balance,
        { id: game.balanceId },
        'value',
        Math.abs(bet.outcome)
      )
    } else {
      await event.manager.save(Credit, {
        value: bet.value,
        balanceId: game.balanceId,
        context: `roulette house win`,
      })
      await event.manager.increment(
        Balance,
        { id: game.balanceId },
        'value',
        bet.value
      )
    }

    logger.info(`AFTER BET ENTITY UPDATED: `, event.entity)
  }

  // /**
  //  * Called before entity insertion.
  //  */
  // beforeRemove(event: RemoveEvent<any>) {
  //   this.logger.info(
  //     `BEFORE BET ENTITY WITH ID ${event.entityId} REMOVED: `,
  //     event.entity
  //   );
  // }

  // /**
  //  * Called after entity insertion.
  //  */
  // afterInsert(event: InsertEvent<any>) {
  //   this.logger.info(`AFTER BET ENTITY INSERTED: `, event.entity);
  // }

  // /**
  //  * Called after entity insertion.
  //  */
  // afterUpdate(event: UpdateEvent<any>) {
  //   this.logger.info(`AFTER BET ENTITY UPDATED: `, event.entity);
  // }

  // /**
  //  * Called after entity insertion.
  //  */
  // afterRemove(event: RemoveEvent<Bet>) {
  //   logger.info(
  //     `AFTER BET ENTITY WITH ID ${event.entityId} REMOVED: `,
  //     event.entity
  //   )
  // }

  // /**
  //  * Called after entity is loaded.
  //  */
  // afterLoad(entity: any) {
  //   this.logger.info(`AFTER BET ENTITY LOADED: `, entity);
  // }
}
