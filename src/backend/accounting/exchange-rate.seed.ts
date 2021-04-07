import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { ExchangeRate } from './exchange-rate.entity';

export class CreateExchangeRate implements Seeder {
  async run(factory: Factory, connection: any): Promise<void> {
    console.log('Creating Exchange Rate');
    try {
      await connection.getRepository(ExchangeRate).findOneOrFail(1);
    } catch {
      const response = await fetch(
        `https://openexchangerates.org/api/latest.json?symbols=BTC&app_id=${process.env.OXR_API_KEY}`,
      );
      const json = await response.json();
      if (json.rates.BTC && !json.error) {
        const value = json.rates.BTC * 100000000; // $1 in btc converted to satoshi
        await factory(ExchangeRate)({
          value,
        }).seed();
      }
    }
  }
}
