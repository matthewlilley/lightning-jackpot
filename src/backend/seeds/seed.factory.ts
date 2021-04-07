import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Seed } from '../seeds';

define(Seed, (faker: typeof Faker, settings: any) => {
  const seed = new Seed();
  seed.value = settings.value;
  return seed;
});
