import 'reflect-metadata'

import { createConnection, getConnection, getRepository } from 'typeorm'

import { Bet } from '.'
import { Game } from '../games'
import { Instance } from '../instances'
import { Jackpot } from '../jackpots'
import { User } from '../users'
import { getDatabaseConfig } from '@lightning-jackpot/testing'

describe('Bets', () => {
  beforeEach(async () => {
    const config = await getDatabaseConfig()
    await createConnection(config)

    const gameRepository = getRepository(Game)
    await gameRepository.save(gameRepository.create({ name: 'roulette' }))

    const instanceRepository = getRepository(Instance)
    await instanceRepository.save(
      instanceRepository.create({ gameId: 1, state: {}, value: 0 })
    )

    const jackpotRepository = getRepository(Jackpot)
    await jackpotRepository.save(
      jackpotRepository.create({
        gameId: 1,
        value: 0,
      })
    )

    const userRepository = getRepository(User)
    await userRepository.save(
      userRepository.create({ balance: { value: 1000 } })
    )
  })

  afterEach(async () => {
    await getConnection().close()
  })

  test('User balance is reduced on successful bet', async () => {
    const betRepository = getRepository(Bet)
    await betRepository.save(
      betRepository.create({
        value: 1000,
        state: {},
        userId: 1,
        instanceId: 1,
      })
    )

    const user = await getRepository(User).findOneOrFail(1, {
      relations: ['balance'],
    })
    expect(user.balance.value).toBe(0)
  })

  test('Instance and Jackpot value is increased on successful bet', async () => {
    const betRepository = getRepository(Bet)
    const bet = await betRepository.save(
      betRepository.create({
        value: 1000,
        state: {},
        userId: 1,
        instanceId: 1,
      })
    )

    const instance = await getRepository(Instance).findOneOrFail(1)
    expect(instance.value).toBe(1000)

    const jackpot = await getRepository(Jackpot).findOneOrFail(1)
    expect(jackpot.value).toBe(
      bet.value * Number(process.env.ROULETTE_JACKPOT_CUT)
    )
  })
})
