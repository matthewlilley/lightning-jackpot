import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Hash } from '../hashing';

define(Hash, (faker: typeof Faker, settings: any) => {
  const hash = new Hash();
  hash.value = settings.value;
  return hash;
});
