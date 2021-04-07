import { Get, JsonController, QueryParam } from 'routing-controllers'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Hash } from '../..'

export interface HashFilter {
  skip: number
  take: number
}

@JsonController()
export class HashController {
  @InjectRepository(Hash)
  private readonly hashes: Repository<Hash>
  @Get('/api/v0/hashes')
  async index(
    @QueryParam('filter', { required: false, parse: true }) filter: HashFilter
  ) {
    // console.log('hashes filter', filter);
    // http://localhost:1337/api/v0/hashes?filter={skip:0,take:10} - Example to filter hashes
    return this.hashes.findOneOrFail({
      select: ['id', 'value'],
      order: { id: 'DESC' },
    })
  }
}
