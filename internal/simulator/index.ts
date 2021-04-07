import { RouletteSimulator } from './Roulette';
import {} from './Roulette';

const run = () => {
  const simulator = new RouletteSimulator(1000, 0.01, 0.01, 10, 50000);
  simulator.run();
};

const runMultiple = times => {
  let result = 0;
  let worst = 0;
  let best = 0;
  for (let i = 0; i <= times; i++) {
    const simulator = new RouletteSimulator(1000, 0.01, 0.05, 10, 50000);
    simulator.run();
    result += simulator.getBankrollInBtc();
    if (simulator.getBankrollInBtc() > best) {
      best = simulator.getBankrollInBtc();
    }
    if (simulator.getBankrollInBtc() < worst) {
      worst = simulator.getBankrollInBtc();
    }
    if (i === 0) {
      worst = simulator.getBankrollInBtc();
      best = simulator.getBankrollInBtc();
    }
  }
  const averageProfit = result / times;
  console.log({ averageProfit, worst, best });
};

// run();
// Runs simulators n times and outputs the result of avg, worst and best case.
runMultiple(1000);
