// import { randomInteger } from 'provably-fair-framework/algorithms';
// import { betOutcome } from '../../src/server/games/roulette/utilities';

// export class RouletteSimulator {
//   private currentRound = 1;
//   private readonly initialInvestment: number = 0;
//   private bankroll: number = 0;
//   private readonly risk: number = 0.01;
//   private readonly activeUsers: number = 5;
//   private readonly maxRounds: number = 0;
//   private readonly betRange: number[] = [0, 0];
//   // #TODO: Add user variation

//   constructor(
//     rounds: number,
//     initialInvestment: number,
//     risk: number,
//     users: number,
//     avgBet: number,
//   ) {
//     this.initialInvestment = initialInvestment;
//     this.bankroll = Number((initialInvestment * 100000000).toPrecision(8));
//     this.maxRounds = rounds;
//     this.risk = risk;
//     this.activeUsers = users;
//     this.betRange = [avgBet, avgBet];
//   }

//   getRiskAmount = () => this.bankroll * this.risk;

//   getMaxWin = () => this.getRiskAmount() / this.activeUsers;

//   getDynamicMaxBet = (value, type) => {
//     // Explanation: This will return the max possible bet a user can make
//     const possibleMaxBet = this.getMaxWin() / this.getMultiplier(type);
//     return (value > possibleMaxBet ? possibleMaxBet : value).toFixed();
//   };

//   getMaxBet = (value, type) => {
//     // Explanation: This will return the max possible bet a user can make
//     const possibleMaxBet = this.getRiskAmount() / this.getMultiplier(type);
//     // console.log(this.getRiskAmount(), this.getMultiplier(type))
//     return (value > possibleMaxBet ? possibleMaxBet : value).toFixed();
//   };

//   getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;
//   getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

//   randomizeBetType = () => {
//     const rng = this.getRandomInt(3) + 1;
//     switch (rng) {
//       case 1:
//         return 'Bear';
//       case 2:
//         return 'Moon';
//       case 3:
//         return 'Bull';
//     }
//   };

//   isEven = value => (value % 2 === 0 ? true : false);

//   getWinningType = value => {
//     if (value === 0) {
//       return 'Moon';
//     }
//     switch (value % 2) {
//       case 0:
//         return 'Bear';
//       case 1:
//         return 'Bull';
//     }
//   };

//   getMultiplier = type => (type === 'Moon' ? 14 : 2);
//   getProbability = type => (type === 'Moon' ? 14 / 15 : 8 / 15);

//   outputCurrentInfo = () => {
//     console.log(
//       `Round #${this.currentRound}, bankroll: ${this.satoshiToBitcoin(
//         this.bankroll,
//       )}`,
//     );
//   };

//   satoshiToBitcoin = (amount: number) =>
//     Number((amount * 0.00000001).toPrecision(8));

//   getJackpotCut = (bet: number) => bet * 0.004;

//   isCompleted = () => (this.currentRound === this.maxRounds ? true : false);
//   getBankrollInBtc = () => this.satoshiToBitcoin(this.bankroll);

//   spinWheel = () => {
//     // NOTE: cus this is a simulation, we can cheat and set the number first.
//     const winningNumber = randomInteger(
//       'sha256',
//       this.getRandomArbitrary(1, 250205205).toString(),
//       'lul:' + this.currentRound,
//       0,
//       14,
//     );
//     const winningType = this.getWinningType(winningNumber);
//     let roundResult = 0;
//     for (let j = 0; j < this.activeUsers; j++) {
//       const type = this.randomizeBetType();
//       const amount = this.getMaxBet(this.betRange[0], type);
//       const isWinner = type === winningType ? true : false;
//       // console.log('BET', { type, amount, isWinner });
//       roundResult +=
//         betOutcome(type, amount, isWinner, null, null, null) -
//         this.getJackpotCut(amount);
//     }
//     // console.log(`Round #${this.currentRound}:`, {
//     //   roundResult,
//     //   winningNumber,
//     //   winningType,
//     // });
//     // console.log('active users', this.activeUsers);
//     // console.log(
//     //   `Before: ${this.bankroll}, after: ${(this.bankroll += roundResult)}`,
//     // );
//     this.bankroll += roundResult;
//     this.currentRound += 1;
//   };

//   run = () => {
//     for (let i = 1; i < this.maxRounds; i++) {
//       this.spinWheel();
//       // if (i % 50 === 0) {
//       //   this.outputCurrentInfo();
//       // }
//     }
//     console.log(`The simulation is finished.`);
//     const bankrollInBTC = this.satoshiToBitcoin(this.bankroll);
//     const profit = bankrollInBTC - this.initialInvestment;
//     console.log(
//       `Initial investment: ${this.initialInvestment}, risk: ${this.risk *
//         100}%, users: ${this.activeUsers}, bet range: ${this.betRange}`,
//     );
//     console.log(
//       `${this.maxRounds} rounds turned ${this.initialInvestment} BTC into ${bankrollInBTC} BTC, a profit of ${profit} BTC`,
//     );
//   };
// }

// export default RouletteSimulator;
