import { Get, JsonController, QueryParam } from 'routing-controllers';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SeedPair } from '../../seeds';

export interface SeedFilter {
  skip: number;
  take: number;
}

@JsonController()
export class SeedController {
  @InjectRepository(SeedPair)
  private readonly seedPairs: Repository<SeedPair>;

  @Get('/api/v0/seeds')
  async getAll(
    @QueryParam('filter', { required: false, parse: true }) filter: SeedFilter,
  ) {
    // console.log('seeds filter', filter);
    // http://localhost:1337/api/v0/seeds?filter={skip:0,take:10} - Example to filter seeds
    return [
      await this.seedPairs.findOneOrFail({
        select: ['id', 'createdAt'],
        relations: ['clientSeed'],
        order: { id: 'DESC' },
      }),
    ].concat(
      await this.seedPairs.find({
        select: ['id', 'createdAt'],
        relations: ['serverSeed', 'clientSeed'],
        order: { id: 'DESC' },
        skip: 1,
        take: 19,
      }),
    );
  }
}
