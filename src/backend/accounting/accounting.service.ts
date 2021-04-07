import { Credit, Debit, Investment } from '.'

import { Balance } from '../balances'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Service } from 'typedi'

@Service()
export class AccountingService {
  @InjectRepository(Balance)
  private readonly balances: Repository<Balance>
  @InjectRepository(Credit)
  private readonly credits: Repository<Credit>
  @InjectRepository(Debit)
  private readonly debits: Repository<Debit>
  @InjectRepository(Investment)
  private readonly investments: Repository<Investment>
  // TODO: Many Credits/Debits to Balance
  // User can have Balance entity, which is made up of many Credits/Debits,
  // this'll allow us to see the context behind what made up the balance.
  // The application can use a single balance as well, which will also give us
  // context behind what made up the overall balance of the application.
  async balance(value): Promise<void> {
    await this.balances.save(this.balances.create({ value }))
  }
  async reduce(balance: Balance, value, context): Promise<void> {
    await this.debit(balance, value, context)
  }
  async increase(balance: Balance, value, context): Promise<void> {
    await this.credit(balance, value, context)
  }
  async credit(balance: Balance, value, context): Promise<void> {
    await this.credits.save(this.credits.create({ value, context, balance }))
  }
  async debit(balance: Balance, value, context): Promise<void> {
    await this.debits.save(this.debits.create({ value, context, balance }))
  }
  async investment(value): Promise<void> {
    await this.investments.save(this.investments.create({ value }))
  }
}
