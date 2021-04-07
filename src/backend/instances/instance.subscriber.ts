import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'

import { Instance } from '.'
import logger from '../logger'
import moment from 'moment'

@EventSubscriber()
export class InstanceSubscriber implements EntitySubscriberInterface<Instance> {
  /**
   * Indicates that this subscriber only listen to Instance events.
   */
  listenTo() {
    return Instance
  }
  /**
   * Called before entity insertion.
   */
  async beforeInsert(event: InsertEvent<Instance>) {
    logger.info(`BEFORE INSTANCE ENTITY INSERTED: `, event.entity)

    const instance = event.entity

    instance.state = {
      startedAt:
        moment().unix() + Number(process.env.ROULETTE_COUNTDOWN_DURATION),
    }
  }

  /**
   * Called after entity insertion.
   */
  async afterInsert(event: InsertEvent<Instance>) {
    logger.info(`AFTER INSTANCE ENTITY INSERTED: `, event.entity)
  }
}
