import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Game } from '../games';

define(Game, (faker: typeof Faker, settings: { name: string, instance, balance } | undefined) => {
  console.log('game factory start', settings);
  const game = new Game();
  game.name = settings ? settings.name : 'Test';
  game.instance = settings ? settings.instance : undefined;
  game.balance = settings ? settings.balance : undefined;
  return game;
});
