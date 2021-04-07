import {
  Authorized,
  Get,
  JsonController,
  QueryParam,
  UseBefore,
} from 'routing-controllers'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Report } from '../..'

export interface ReportFilter {
  take: number
  skip: number
  type: string
}

@JsonController()
export class ReportController {
  @InjectRepository(Report)
  private readonly reports: Repository<Report>

  @Authorized(['admin'])
  @Get('/api/v0/admin/reports')
  getAll(
    @QueryParam('filter', { required: true, parse: true }) filter: ReportFilter
  ) {
    console.log('reports api filter', filter)
    // http://localhost:1337/api/v0/admin/reports?filter={"limit":"10","offset":"0","type":"HOURLY"}
    return this.reports.find({
      select: [
        'id',
        'type',
        'EV2x',
        'EV14x',
        'totalEV',
        'value2x',
        'value14x',
        'totalValue',
        'createdAt',
      ],
      take: filter ? filter.take : 30,
      skip: filter ? filter.skip : 0,
      where: {
        type: filter.type,
      },
    })
  }
}
