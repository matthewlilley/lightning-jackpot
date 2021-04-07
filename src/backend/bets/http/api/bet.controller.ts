import {
  Authorized,
  Get,
  JsonController,
  QueryParam,
  Req,
} from 'routing-controllers'
import { Bet, BetRepository } from '../..'
import { Logger, LoggerInterface } from '../../../logger'
import { InjectRepository } from 'typeorm-typedi-extensions'

export interface BetFilter {
  take: number
  skip: number
  gameId: number
  instanceId: number
  userId: number
}

@JsonController()
export class BetController {
  @Logger()
  private readonly logger: LoggerInterface

  @InjectRepository(Bet)
  private readonly bets: BetRepository

  @Authorized()
  @Get('/api/v0/bets')
  async all(
    @Req() req,
    @QueryParam('filter', { required: false, parse: true })
    filter: BetFilter
  ) {
    this.logger.debug('bets filter', filter)
    this.logger.debug(req.user.roles.indexOf('admin') !== -1 && filter && filter.userId ? filter.userId : req.user.id)
    // http://localhost:1337/api/v0/bets?filter={"limit":"10","offset":"0"}
    return this.bets.find({
      order: { id: 'DESC' },
      relations: ['instance'],
      where: {
        // gameId: filter && filter.gameId ? filter.gameId : undefined,
        // instanceId: filter && filter.instanceId ? filter.instanceId : undefined,
        userId: req.user.roles.indexOf('admin') !== -1 && filter && filter.userId ? filter.userId : req.user.id,
      },
      take: filter ? filter.take : 50,
      skip: filter ? filter.skip : 0,
    })
  }
}
