import debug from 'debug'
import { randomInteger, Algorithm, Strategy } from 'provably-fair-framework'

const log = debug('lightning-jackpot:roulette-strategy')

export class RouletteStrategy implements Strategy {
  static readonly min = 0
  static readonly max = 14
  static readonly range = RouletteStrategy.max + 1 - RouletteStrategy.min
  calculate(algorithm: Algorithm, inputs: [string, string]): number {
    log('RouletteStrategy', algorithm, inputs)
    return randomInteger(
      algorithm,
      inputs,
      RouletteStrategy.min,
      RouletteStrategy.max
    )
  }
  // verify(
  //   algorithm: Algorithm,
  //   inputs: [string, string],
  //   winningNumber: number
  // ) {
  //   return winningNumber === this.calculate(algorithm, inputs);
  // }
}
