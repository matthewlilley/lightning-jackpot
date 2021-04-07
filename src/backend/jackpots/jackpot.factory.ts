import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Jackpot } from '../jackpots';

define(Jackpot, (
  faker: typeof Faker,
  settings: any,
) => {
  const jackpot = new Jackpot();
  jackpot.game = settings.game;
  jackpot.value = 1337;
  return jackpot;
});
