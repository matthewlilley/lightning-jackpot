import debug from 'debug'
import { randomInteger, Algorithm, Strategy } from 'provably-fair-framework'

const log = debug('provably-fair:progressive-jackpot')

export class ProgressiveJackpotStrategy implements Strategy {
  calculate(
    algorithm: Algorithm,
    inputs: [string, string, number, number]
  ): boolean {
    const [serverSeed, clientSeed, value, oneMilliolDollarsInSatoshi] = inputs

    const output = randomInteger(
      algorithm,
      [serverSeed, clientSeed],
      0,
      Number(oneMilliolDollarsInSatoshi)
    )

    log({
      output,
      value,
      oneMilliolDollarsInSatoshi: Number(oneMilliolDollarsInSatoshi),
      valueMoreThanOrEqualToOutput: value >= output,
    })

    return value >= output
  }
}

export default ProgressiveJackpotStrategy
