import { Balance } from '.'
import Faker from 'faker'
import { define } from 'typeorm-seeding'

define(Balance, (faker: typeof Faker, value: number | any) => {
  const balance = new Balance()
  balance.value = value
  return balance
})
