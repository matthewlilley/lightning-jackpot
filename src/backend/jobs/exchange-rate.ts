import moment from "moment";
import { getConnection, getRepository } from "typeorm";
import { ExchangeRate } from "../accounting";
import logger from "../logger";

export async function oneDollarInBtc() {
  const response = await fetch(
    `https://openexchangerates.org/api/latest.json?symbols=BTC&app_id=${process.env.OXR_API_KEY}`
  );
  const json = await response.json();
  return json.rates.BTC;
}

export async function exchangeRate() {
  try {
    const connection = getConnection();
    const repository = connection.getRepository(ExchangeRate);
    const rate = await repository.findOneOrFail({
      order: { id: "DESC" }
    });

    if (moment(rate.createdAt).isBefore(moment().subtract(24, "hours"))) {
      const response = await fetch(
        `https://openexchangerates.org/api/latest.json?symbols=BTC&app_id=${process.env.OXR_API_KEY}`
      );
      const json = await response.json();
      if (json.rates.BTC && !json.error) {
        const value = json.rates.BTC * 100000000; // $1 in btc converted to satoshi
        if (value) {
          logger.info(
            `🕒 JOB - Exchange rate fetch - Saving fetched exchange rate 🕒`
          );
          await repository.save(
            repository.create({
              value
            })
          );
        } else {
          logger.error(`Could not fetch exchange rate from external api`);
        }
      }
    }
  } catch (error) {
    logger.error(
      `Something went wrong while trying to save exchange rate.`,
      error
    );
  }
}
