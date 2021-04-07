import { Authorized, Get, JsonController, Req } from 'routing-controllers'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Game } from '../..'
import { Logger, LoggerInterface } from '../../../logger'

@JsonController()
export class GameController {
  @Logger()
  private readonly logger: LoggerInterface
  @InjectRepository(Game)
  private readonly games: Repository<Game>
  @Authorized()
  @Get('/api/v0/games/:game')
  async getOne(@Req() req) {
    return this.games.findOneOrFail({ name: req.params.game })
  }
}
