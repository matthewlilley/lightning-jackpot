import { Authorized, Get, JsonController, UseBefore } from 'routing-controllers'
import { Logger, LoggerInterface } from '../../logger'

import { InjectRepository } from 'typeorm-typedi-extensions'
import { PerformanceIndicator } from '../../performance-indicators'
import { Repository } from 'typeorm'

@JsonController()
export class PerformanceIndicatorController {
  @Logger()
  private readonly logger: LoggerInterface

  @InjectRepository(PerformanceIndicator)
  private readonly performanceIndicators: Repository<PerformanceIndicator>

  @Authorized(['admin'])
  @Get('/api/v0/performance-indicators')
  async index() {
    const performanceIndicators = await this.performanceIndicators.find()
    this.logger.debug('performance indicators', performanceIndicators)
    return performanceIndicators
  }
}
