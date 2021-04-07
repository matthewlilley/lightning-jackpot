import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Transaction, TransactionStatus } from '../transactions';

define(Transaction, (faker: typeof Faker, settings: any) => {
  const transaction = new Transaction();
  transaction.value = faker.random.number(1000000);
  transaction.paymentRequest = 'test';
  transaction.userId = 1;
  transaction.status = TransactionStatus.Confirmed;
  return transaction;
});
