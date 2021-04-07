import { createHash } from 'crypto'
import { createSystem } from 'provably-fair-framework'
import { Connection } from 'typeorm'
import { Factory, Seeder, times } from 'typeorm-seeding'
import { Hash } from '../hashing'
import { Seed, SeedPair } from '../seeds'

export class CreateSeedPairs implements Seeder {
  async run(factory: Factory, connection: any): Promise<void> {
    console.log('Creating SeedPairs')
    const em = connection.createEntityManager()
    const provablyFair = createSystem({ algorithm: 'sha256' })
    await times(1, async n => {
      const [serverSeed, clientSeed] = await provablyFair.createSeedPair()

      const seedPair = await factory(SeedPair)().make()

      seedPair.serverSeed = await factory(Seed)({ value: serverSeed }).seed()
      seedPair.clientSeed = await factory(Seed)({ value: clientSeed }).seed()

      await em.save(seedPair)

      await factory(Hash)({
        value: createHash('sha256')
          .update(serverSeed)
          .digest('hex'),
      }).seed()
    })
  }
}
