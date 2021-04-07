import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'

import { Balance } from '../balances'
import { Game } from '.'

@EventSubscriber()
export class GameSubscriber implements EntitySubscriberInterface<Game> {
  /**
   * Indicates that this subscriber only listen to Game events.
   */
  listenTo() {
    return Game
  }

  /**
   * Called before entity insertion.
   */
  async beforeInsert(event: InsertEvent<Game>) {
    // const game = event.entity
    // if (!game.balance) {
    //   game.balance = await event.manager.save(event.manager.create(Balance))
    // }
  }
}
