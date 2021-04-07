import { Factory, Seeder } from 'typeorm-seeding'

import { Balance } from '../balances'
import { Connection } from 'typeorm'
import { Investment } from '../accounting'

export class CreateInvestments implements Seeder {
  async run(factory: Factory, connection: any): Promise<void> {
    console.log('Creating Investments')
    await factory(Investment)(9824663).seed()
  }
}
