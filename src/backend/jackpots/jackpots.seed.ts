import { Factory, Seeder } from 'typeorm-seeding';
import { Game } from '../games';
import { Jackpot } from '../jackpots';
export class CreateJackpots implements Seeder {
  async run(factory: Factory, connection: any): Promise<void> {
    try {
      const entityManager = connection.createEntityManager();
      const game = await entityManager.findOneOrFail(Game, { where: { name: 'roulette' }});
      const jackpot = await factory(Jackpot)({ game }).seed();
      await entityManager.save(Game, { ...game, jackpot });
    } catch (e) {
      console.error(e);
    }
  }
}
