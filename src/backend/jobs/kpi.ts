import { sumBy } from 'lodash';
import moment from 'moment';
import { Equal, MoreThan, getConnection } from 'typeorm';
import { Bet } from '../bets';
import logger from '../logger';
import { PerformanceIndicator } from '../performance-indicators';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../transactions';
import { User } from '../users';

export async function kpi() {
  logger.info('KPI');
  const connection = getConnection();
  const performanceIndicators = connection.getRepository(PerformanceIndicator);
  const userRepository = connection.getRepository(User);
  const transactionsRepository = connection.getRepository(Transaction);
  const betRepository = connection.getRepository(Bet);
  const yesterday = moment()
    .subtract(1, 'days')
    .startOf('day')
    .format('YYYY-MM-DD HH:mm:ss');
  logger.info('KPI', 'Yesterday', yesterday);

  const users = await userRepository.count({ createdAt: MoreThan(yesterday) });

  const transactions = await transactionsRepository.find({
    status: TransactionStatus.Confirmed,
    type: Equal(TransactionType.Deposit),
    createdAt: MoreThan(yesterday),
  });

  const depositVolume = sumBy(transactions, 'value');

  const bets = await betRepository.find({
    createdAt: MoreThan(yesterday),
  });

  const betVolume = sumBy(bets, 'value');

  await performanceIndicators.save(
    performanceIndicators.create({
      betVolume,
      depositVolume,
      users,
    }),
  );

  logger.info('Stored KPI');
}
