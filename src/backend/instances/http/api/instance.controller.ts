import { Get, JsonController, QueryParam, Req } from 'routing-controllers'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Logger, LoggerInterface } from '../../../logger'
import { Instance, InstanceRepository } from '../..'
import { classToPlain } from 'class-transformer'

export interface InstanceFilter {
  limit: number
  offset: number
  gameId: number
  game: string
}

@JsonController()
export class InstanceController {
  @Logger()
  private readonly logger: LoggerInterface

  @InjectRepository(Instance)
  private readonly instances: InstanceRepository

  @Get('/api/v0/instances')
  async all(
    @QueryParam('filter', { required: false, parse: true })
    filter: InstanceFilter
  ) {
    console.log('instance api filter', filter)
    // http://localhost:1337/api/v0/instances?filter={limit:10,offset:0,seed:1}
    return this.instances.find({
      select: ['id', 'state'],
      order: { id: 'DESC' },
      where: { gameId: filter && filter.gameId ? filter.gameId : undefined },
      take: filter ? filter.limit : 10,
      skip: filter ? filter.offset : 0,
    })
  }

  @Get('/api/v0/instances/:id')
  async getOne(@Req() req) {
    const instance = await this.instances.findOneOrFail(req.params.id, {
      order: { id: 'DESC' },
      relations: ['bets', 'game'],
      cache: false,
    })
    return classToPlain(instance, { groups: [instance.game.name] })
  }
}
