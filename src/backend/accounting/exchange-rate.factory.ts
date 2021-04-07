import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { ExchangeRate } from './exchange-rate.entity';

define(ExchangeRate, (faker: typeof Faker, settings: any) => {
  const exchangeRate = new ExchangeRate();
  exchangeRate.value = settings.value;
  return exchangeRate;
});
