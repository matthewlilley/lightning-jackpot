import moment from 'moment';
import { MoreThan, getConnection, getRepository } from 'typeorm';
import { Instance } from '../instances';
import logger from '../logger';
import { Report } from '../reports';

const standardDeviation = (betMultiplier, amount, rounds) => {
  const jackpotCutMultiplier = 1 - Number(process.env.ROULETTE_JACKPOT_CUT);
  // 2x bet,    2 * betAmount * sqrt(rounds * 7/15 * 8/15 * jackpotodds)
  const numbersCount = 15;
  let payoutMultiplier = 2;
  let winningNumbers = 7;
  let losingNumbers = 8;
  if (betMultiplier === '14x') {
    // 14x bet, 14 * betAmount * sqrt(rounds * 1/15 * 14/15 * jackpotodds)
    payoutMultiplier = 14;
    winningNumbers = 1;
    losingNumbers = 14;
  }
  const odds =
    rounds *
    ((winningNumbers / numbersCount) *
      (losingNumbers / numbersCount) *
      jackpotCutMultiplier);

  // calculate an average bet size
  const avgBet = amount / rounds;
  const expectedValue = payoutMultiplier * avgBet * Math.sqrt(odds);
  return expectedValue;
};

export async function report(type: string) {
  try {
    logger.info(`💰  [ ${type} ] report is being saved. 💰`);
    const date = moment().utc();

    if (type === 'day') {
      date.subtract(1, 'd');
    } else if (type === 'hour') {
      date.subtract(1, 'h');
    } else if (type === 'minuite') {
      date.subtract(1, 'm');
    }

    const connection = getConnection();

    const reportRepository = connection.getRepository(Report);

    const instanceRepository = connection.getRepository(Instance);

    const [instances, count] = await instanceRepository.findAndCount({
      where: {
        createdAt: MoreThan(date.toISOString()),
      },
      relations: ['bets'],
      order: { id: 'DESC' },
    });

    if (count > 0) {
      const bets = instances.reduce(
        (previousValue: any, currentValue: any) => [
          ...previousValue,
          ...currentValue.bets,
        ],
        [],
      );
      // logger.debug('Bets', bets)
      const x2 = bets
        .filter(bet => bet.state.type === 'Bear' || bet.state.type === 'Bull')
        .reduce(
          (previousValue: any, currentValue: any) => {
            return {
              totalValue: previousValue.totalValue + currentValue.value,
              realValue: previousValue.realValue + currentValue.outcome,
            };
          },
          { totalValue: 0, realValue: 0 },
        );
      // logger.debug('Bets x2', bets)
      const x14 = bets
        .filter(bet => bet.state.type === 'Moon')
        .reduce(
          (previousValue: any, currentValue: any) => {
            return {
              totalValue: previousValue.totalValue + currentValue.value,
              realValue: previousValue.realValue + currentValue.outcome,
            };
          },
          { totalValue: 0, realValue: 0 },
        );

      const EV2x = standardDeviation('2x', x2.totalValue, count);
      const EV14x = standardDeviation('14x', x14.totalValue, count);

      logger.debug('Saving report');
      await reportRepository.save(
        reportRepository.create({
          type,
          EV2x,
          EV14x,
          // * -1, cus the incoming result is from their perspective?
          value2x: x2.realValue * -1,
          value14x: x14.realValue * -1,
          totalValue: x14.realValue + x2.realValue,
          totalEV: EV2x + EV14x,
        }),
      );
      // logger.debug('Report saved', report);
    } else {
      logger.debug('No reports found');
    }
  } catch (error) {
    logger.error(
      `Something went wrong while trying to save the ${type} profit report.`, error
    );
  }
}
