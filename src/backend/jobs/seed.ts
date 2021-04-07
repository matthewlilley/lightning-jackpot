import { createHash } from 'crypto'
import { createSystem } from 'provably-fair-framework'
import { getConnection } from 'typeorm'
import { Hash } from '../hashing'
import logger from '../logger'
import { Seed, SeedPair } from '../seeds'

const system = createSystem({
  algorithm: 'sha256',
})

export async function seed() {
  try {
    logger.info('🌱 Generating seed 🌱')
    const connection = getConnection()
    await connection.transaction(async transactionalEntityManager => {
      const [serverSeed, clientSeed] = await system.createSeedPair()
      await transactionalEntityManager.save(
        transactionalEntityManager.create(SeedPair, {
          serverSeed: transactionalEntityManager.create(Seed, {
            value: serverSeed,
          }),
          clientSeed: transactionalEntityManager.create(Seed, {
            value: clientSeed,
          }),
        })
      )
      logger.info('Seed pair saved.')
      await transactionalEntityManager.save(
        transactionalEntityManager.create(Hash, {
          value: createHash('sha256')
            .update(serverSeed)
            .digest('hex'),
        })
      )
      logger.info('Hash saved.')
    })
  } catch (error) {
    logger.error('Error generating seed', error)
  }
}
