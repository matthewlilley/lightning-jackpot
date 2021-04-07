import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Investment } from './investment.entity';

define(Investment, (faker: typeof Faker, value: number | any) => {
  const investment = new Investment();
  investment.value = value;
  return investment;
});
