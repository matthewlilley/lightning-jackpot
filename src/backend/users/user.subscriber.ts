import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'

import { Balance } from '../balances'
import { User } from '.'
import logger from '../logger'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo() {
    return User
  }

  /**
   * Called before entity insertion.
   */
  async beforeInsert(event: InsertEvent<User>) {
    logger.debug(`BEFORE USER ENTITY INSERTED: `, event.entity)
    const user = event.entity

    if (!user.balance) {
      logger.debug('ADD USER BALANCE')
      user.balance = await event.manager.save(event.manager.create(Balance))
    }

    // if (!user.tagId) {
    //   user.tagId = 2
    // }

    logger.debug(`AFTER USER ENTITY INSERTED: `, event.entity)
  }

  async afterInsert(event: InsertEvent<User>) {
    event.entity.name = `Satoshi #${event.entity.id}`
    await event.manager.save(event.entity)
  }
}
