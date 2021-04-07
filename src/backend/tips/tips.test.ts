import 'reflect-metadata'

import { createConnection, getConnection, getRepository } from 'typeorm'

import { Tip } from '.'
import { User } from '../users'
import { getDatabaseConfig } from '@lightning-jackpot/testing'

describe('Tips', () => {
  beforeAll(async () => {
    const config = await getDatabaseConfig()
    await createConnection(config)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  test('Tipper balanced is reduced and recipient balanced increated on successful tip', async () => {
    const userRepository = getRepository(User)

    const tipper = await userRepository.save(
      userRepository.create({ balance: { value: 1000 + 25 } }) // value + fee we need
    )

    const recipient = await userRepository.save(
      userRepository.create({ balance: { value: 0 } })
    )

    expect(tipper.balance.value).toBe(1025)
    expect(recipient.balance.value).toBe(0)

    const tipRepository = getRepository(Tip)
    await tipRepository.save(
      tipRepository.create({
        tipper,
        recipient,
        value: 1000,
        fee: 1000 * Number(process.env.TIP_FEE),
      })
    )

    expect(
      (await userRepository.findOneOrFail(tipper.id, {
        relations: ['balance'],
      })).balance.value
    ).toBe(0)
    expect(
      (await userRepository.findOneOrFail(recipient.id, {
        relations: ['balance'],
      })).balance.value
    ).toBe(1000)
  })
})
