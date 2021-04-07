export interface RouletteConfig {
  countdownDuration: number;
  spinDuration: number;
  endDuration: number;
  teaserProbability: number;
}

const config: RouletteConfig = {
  countdownDuration: Number(process.env.ROULETTE_COUNTDOWN_DURATION),
  spinDuration: Number(process.env.ROULETTE_SPIN_DURATION),
  endDuration: Number(process.env.ROULETTE_END_DURATION),
  teaserProbability: Number(process.env.ROULETTE_TEASER_PROBABILITY),
};

export default config;
