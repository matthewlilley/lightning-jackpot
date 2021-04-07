import { EntityRepository, Repository } from 'typeorm'
import { Jackpot } from '../jackpots'

@EntityRepository(Jackpot)
export class JackpotRepository extends Repository<Jackpot> {}
