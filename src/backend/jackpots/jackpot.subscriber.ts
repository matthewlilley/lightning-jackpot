import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'

import { Jackpot } from '../jackpots'
import logger from '../logger'

@EventSubscriber()
export class JackpotSubscriber implements EntitySubscriberInterface<Jackpot> {
  /**
   * Indicates that this subscriber only listen to Jackpot events.
   */
  listenTo() {
    return Jackpot
  }
  /**
   * Called before entity insertion.
   */
  async beforeInsert(event: InsertEvent<Jackpot>) {
    logger.info(`BEFORE JACKPOT ENTITY INSERTED: `, event.entity)
  }
}
