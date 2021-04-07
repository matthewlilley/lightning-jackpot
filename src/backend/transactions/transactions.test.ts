import 'reflect-metadata'

import { Transaction, TransactionStatus, TransactionType } from '.'
import { createConnection, getConnection, getRepository } from 'typeorm'

import { User } from '../users'
import { getDatabaseConfig } from '@lightning-jackpot/testing'
import nanoid from 'nanoid'

describe('Transactions', () => {
  beforeEach(async () => {
    const config = await getDatabaseConfig()
    await createConnection(config)
  })

  afterEach(async () => {
    await getConnection().close()
  })

  describe('Withdrawals', () => {
    test('User balance is reduced on successful withdrawal', async () => {
      const userRepository = getRepository(User)

      const user = await userRepository.save(
        userRepository.create({ balance: { value: 1000 } })
      )

      expect(user.balance.value).toBe(1000)

      const transactionRepository = getRepository(Transaction)

      await transactionRepository.save(
        transactionRepository.create({
          value: 1000,
          type: TransactionType.Withdrawal,
          status: TransactionStatus.Confirmed,
          paymentRequest: nanoid(),
          user,
        })
      )

      expect(
        (await getRepository(User).findOneOrFail(user.id, {
          relations: ['balance'],
        })).balance.value
      ).toBe(0)
    })
  })

  describe('Deposits', () => {
    test('User balance is increased on successful deposit', async () => {
      const userRepository = getRepository(User)

      const user = await userRepository.save(userRepository.create())

      expect(user.balance.value).toBe(0)

      const transactionRepository = getRepository(Transaction)

      await transactionRepository.save(
        transactionRepository.create({
          value: 1000,
          type: TransactionType.Deposit,
          status: TransactionStatus.Confirmed,
          paymentRequest: nanoid(),
          user,
        })
      )

      expect(
        (await getRepository(User).findOneOrFail(user.id, {
          relations: ['balance'],
        })).balance.value
      ).toBe(1000)
    })
  })
})
