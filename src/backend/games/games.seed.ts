import { Factory, Seeder } from 'typeorm-seeding'

import { Game } from '../games'
import { Instance } from '../instances'
import { Balance } from '../balances';

export class CreateGames implements Seeder {
  async run(factory: Factory, connection: any): Promise<void> {
    const entityManager = connection.createEntityManager();

    if (!await entityManager.findOne(Game, 1)) {
      const game = await factory(Game)({
        name: 'roulette',
        balance: await factory(Balance)(9824663).seed(),
      }).seed();

      await entityManager.save(Game, {
        ...game,
        instance: await factory(Instance)({ game }).seed(),
      })
    }
  }
}
