import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { SeedPair } from '../seeds';

define(SeedPair, () => {
  const seedPair = new SeedPair();
  return seedPair;
});
