import { Get, JsonController, Req, Res } from 'routing-controllers'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Bet, BetRepository } from '../../../bets'
import { Instance, InstanceRepository } from '../../../instances'
import { Jackpot, JackpotRepository } from '../../../jackpots'
import { Logger, LoggerInterface } from '../../../logger'
import { User } from '../../../users'
import { RouletteService } from '../../roulette.service'
import { Container, Inject } from 'typedi'
import { Game, GameRepository } from '../../../games'

@JsonController()
export class InitialController {
  @Logger()
  private readonly logger: LoggerInterface

  @InjectRepository(Game)
  private readonly games: GameRepository

  @InjectRepository(Bet)
  private readonly bets: BetRepository

  @InjectRepository(User)
  private readonly users: Repository<User>

  @InjectRepository(Instance)
  private readonly instances: InstanceRepository

  @Inject()
  private readonly roulette: RouletteService

  @Get('/api/v0/roulette')
  async index(@Req() req, @Res() res) {
    this.logger.info('InitialController api/v0/roulette')
    return {
      // game: await this.games.findOneOrFail({ where: { name: 'roulette' } }),
      instance: await this.roulette.instance(),
      instances: await this.roulette.instances(),
      jackpot: await this.roulette.jackpot(),
      players: await this.users.count(),
      spins: await this.instances.count() - 1,
      satoshi: await this.bets.satoshi(),
    }
  }
}
