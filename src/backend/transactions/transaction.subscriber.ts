import { Credit, Debit } from '../accounting'
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm'
import { Transaction, TransactionStatus, TransactionType } from '.'

import { Balance } from '../balances'
import logger from '../logger'

@EventSubscriber()
export class TransactionSubscriber
  implements EntitySubscriberInterface<Transaction> {
  /**
   * Indicates that this subscriber only listen to Transaction events.
   */
  listenTo() {
    return Transaction
  }

  /**
   * Called before entity insertion.
   */
  async beforeInsert(event: InsertEvent<Transaction>) {
    logger.debug(`START BEFORE TRANSACTION ENTITY INSERTED: `, event.entity)

    const transaction = event.entity

    if (transaction.status === TransactionStatus.Confirmed) {
      if (transaction.type === TransactionType.Deposit) {
        await event.manager.save(Credit, {
          value: transaction.value,
          balanceId: transaction.user.balanceId,
          context: 'deposit',
        })

        await event.manager.increment(
          Balance,
          { id: transaction.user.balanceId },
          'value',
          transaction.value
        )
      } else if (transaction.type === TransactionType.Withdrawal) {
        await event.manager.save(Debit, {
          value: transaction.value,
          balanceId: transaction.user.balanceId,
          context: 'withdrawal',
        })

        await event.manager.decrement(
          Balance,
          { id: transaction.user.balanceId },
          'value',
          transaction.value
        )
      }
    }

    logger.debug(`END BEFORE TRANSACTION ENTITY INSERTED`)
  }

  /**
   * Called before entity insertion.
   */
  async beforeUpdate(event: UpdateEvent<Transaction>) {
    logger.debug(`START BEFORE TRANSACTION ENTITY UPDATED: `, event)

    const transaction = event.entity

    if (transaction.status === TransactionStatus.Confirmed) {
      if (transaction.type === TransactionType.Deposit) {
        await event.manager.save(Credit, {
          value: transaction.value,
          balanceId: transaction.user.balanceId,
          context: 'deposit',
        })

        await event.manager.increment(
          Balance,
          { id: transaction.user.balanceId },
          'value',
          transaction.value
        )
      } else if (transaction.type === TransactionType.Withdrawal) {
        await event.manager.save(Debit, {
          value: transaction.value,
          balanceId: transaction.user.balanceId,
          context: 'withdrawal',
        })

        await event.manager.decrement(
          Balance,
          { id: transaction.user.balanceId },
          'value',
          transaction.value
        )
      }
    }
    logger.debug(`END BEFORE TRANSACTION ENTITY UPDATED`)
  }

  /**
   * Called after entity insertion.
   */
  afterUpdate(event: UpdateEvent<any>) {
    logger.debug(`AFTER TRANSACTION ENTITY UPDATED: `, event.entity)

    // io.of('/').adapter.customRequest({
    //   event: 'transactionUpdated',
    //   transaction,
    // })
  }
}
