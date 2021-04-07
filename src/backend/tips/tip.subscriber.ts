import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'

import { Balance } from '../balances'
import { Tip } from '.'
import { User } from '../users'
import logger from '../logger'

@EventSubscriber()
export class TipSubscriber implements EntitySubscriberInterface<Tip> {
  /**
   * Indicates that this subscriber only listen to Tip events.
   */
  listenTo() {
    return Tip
  }

  /**
   * Called before entity insertion.
   */
  async beforeInsert(event: InsertEvent<Tip>) {
    logger.info(`START BEFORE TIP ENTITY INSERTED: `, event.entity)

    const tip = event.entity

    const tipper = await event.connection.manager.findOneOrFail(
      User,
      tip.tipperId,
      { relations: ['balance'] }
    )

    const recipient = await event.connection.manager.findOneOrFail(
      User,
      tip.recipientId,
      { relations: ['balance'] }
    )

    await event.connection.manager.update(Balance, tipper.balanceId, {
      value: tipper.balance.value - (tip.value + tip.fee),
    })

    await event.connection.manager.update(Balance, recipient.balanceId, {
      value: recipient.balance.value + tip.value,
    })

    logger.info(`END BEFORE TIP ENTITY INSERTED`)
  }
}
