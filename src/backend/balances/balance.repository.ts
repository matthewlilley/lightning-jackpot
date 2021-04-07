import { EntityRepository, Repository } from 'typeorm'

import { Balance } from '.'

@EntityRepository(Balance)
export class BalanceRepository extends Repository<Balance> {}
