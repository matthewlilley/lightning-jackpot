import moment from 'moment'
import {
  Authorized,
  Get,
  JsonController,
  QueryParam,
  Req,
} from 'routing-controllers'
import { MoreThan, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Transaction, TransactionStatus } from '../..'

export interface TransactionFilter {
  limit: number
  offset: number
  type: string
}

@JsonController()
export class TransactionController {
  @InjectRepository(Transaction)
  private readonly transactions: Repository<Transaction>

  @Authorized()
  @Get('/api/v0/transactions')
  all(
    @Req()
    req,
    @QueryParam('filter', { required: false, parse: true })
    filter: TransactionFilter
  ) {
    console.log('transactions filter', filter)
    // http://localhost:1337/api/v0/transactions?filter={"limit":"10","offset":"0","type":"deposit"}

    return this.transactions.find({
      select: [
        'id',
        'type',
        'value',
        'paymentRequest',
        'userId',
        'status',
        'createdAt',
      ],
      order: { id: 'DESC' },
      where: [
        {
          userId: req.user.id,
          status: TransactionStatus.Pending,
          createdAt: MoreThan(
            moment()
              .subtract(10, 'minutes')
              .toDate()
          ),
        },
        { userId: req.user.id, status: TransactionStatus.Confirmed },
      ],
      take: filter ? filter.limit : 50,
      skip: filter ? filter.offset : 0,
    })
  }
}
