import { Game, GameRepository } from '../games'
import { Instance, InstanceRepository } from '../instances'
import { Jackpot, JackpotRepository } from '../jackpots'
import { Logger, LoggerInterface } from '../logger'

import { Balance } from '../balances'
import { CreateBet } from './create-bet'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Service } from 'typedi'
import { classToPlain } from 'class-transformer'

@Service()
export class RouletteService {
  @Logger()
  private readonly logger: LoggerInterface

  @InjectRepository(Instance)
  private readonly instanceRepository: InstanceRepository

  @InjectRepository(Game)
  private readonly gameRepository: GameRepository

  @InjectRepository(Jackpot)
  private readonly jackpotRepository: JackpotRepository

  @InjectRepository(Balance)
  private readonly balanceRepository: Repository<Balance>

  private gameId: number

  private balanceId: number

  private game: Game

  async getGameId(): Promise<number> {
    if (this.gameId) {
      return this.gameId
    }
    const { id } = await this.gameRepository.findOneOrFail({
      select: ['id'],
      where: { name: 'roulette' },
      cache: false,
    })
    this.gameId = id
    return this.gameId
  }

  async getGame(): Promise<Game> {
    if (this.game) {
      return this.game
    }
    this.game = await this.gameRepository.findOneOrFail({
      where: { name: 'roulette' },
      relations: ['balance', 'instance', 'instance.bets', 'jackpot'],
      cache: false,
    })
    return this.game
  }

  async getBalanceId(): Promise<number> {
    if (this.balanceId) {
      return this.balanceId
    }
    const { balanceId } = await this.gameRepository.findOneOrFail({
      select: ['balanceId'],
      where: { name: 'roulette' },
    })
    this.balanceId = balanceId
    return this.balanceId
  }

  async balance(): Promise<Balance> {
    return this.balanceRepository.findOneOrFail(await this.getBalanceId())
  }

  async instance(): Promise<object> {
    const instance = await this.instanceRepository.findOneOrFail({
      where: { gameId: await this.getGameId() },
      relations: ['bets'],
      order: { id: 'DESC' },
      cache: false,
    })
    return classToPlain(instance, { groups: ['roulette'] })
  }

  async instances(): Promise<any> {
    return classToPlain(
      await this.instanceRepository.find({
        where: {
          gameId: await this.getGameId(),
        },
        order: { id: 'DESC' },
        select: ['id', 'state'],
        skip: 1,
        take: 10,
      })
    )
  }

  async jackpot(): Promise<Jackpot> {
    return this.jackpotRepository.findOneOrFail({
      where: {
        gameId: await this.getGameId(),
      },
      order: { id: 'DESC' },
      select: ['id', 'value'],
    })
  }

  // async createBet(bet: CreateBet): Bet {
  //   //
  // }
  // async createInstance(instance: CreateInstance): Instance {
  //   //
  // }
}
