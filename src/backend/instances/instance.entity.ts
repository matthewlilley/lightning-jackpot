import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { InstanceStatus, RouletteState } from '@lightning-jackpot/common'

import { Bet } from '../bets'
import { Expose } from 'class-transformer'
import { Game } from '../games'
import { InstanceMeta } from '.'
import { Jackpot } from '../jackpots'
import { SeedPair } from '../seeds'
import moment from 'moment'

export interface CoinflipState {
  side?: 'heads' | 'tails'
}

@Entity()
export class Instance {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: 0, unsigned: true })
  value: number

  @Column({ nullable: true })
  gameId: number

  @ManyToOne(() => Game, game => game.instances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  game: Game

  @Column({ nullable: true })
  jackpotId: number

  @OneToOne(() => Jackpot, jackpot => jackpot.instance, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  jackpot: Jackpot

  @Column({ nullable: true })
  seedPairId: number

  @ManyToOne(() => SeedPair, seed => seed.instances, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  seedPair: SeedPair

  @OneToMany(() => InstanceMeta, meta => meta.instance, {
    cascade: true,
    eager: true,
  })
  meta: InstanceMeta[]

  @OneToMany(() => Bet, bet => bet.instance, {
    cascade: true,
    eager: false,
  })
  bets: Bet[]

  @Column({
    type: 'json',
    nullable: true,
  })
  state: RouletteState & CoinflipState

  @Column({
    type: 'enum',
    enum: InstanceStatus,
    default: InstanceStatus.default,
  })
  status: InstanceStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Expose({ groups: ['roulette'] })
  spinning = (): boolean => moment().unix() >= this.state.startedAt

  @Expose({ groups: ['roulette'] })
  spun = (): boolean =>
    moment().unix() >=
    this.state.startedAt + Number(process.env.ROULETTE_SPIN_DURATION)

  @Expose({ groups: ['roulette'] })
  countdownDuration = (): number =>
    !this.spinning() ? this.state.startedAt - moment().unix() : 0

  @Expose({ groups: ['roulette'] })
  spinDuration = (): number => {
    const difference = moment().unix() - this.state.startedAt
    return !this.spinning() ? 5 : difference <= 5 ? 5 - difference : 0
  }

  @Expose({ groups: ['roulette'] })
  endDuration = (): number => {
    const difference =
      moment().unix() -
      (this.state.startedAt + Number(process.env.ROULETTE_SPIN_DURATION))
    return !this.spun() ? 5 : difference <= 5 ? 5 - difference : 0
  }

  @Expose({ groups: ['roulette'] })
  ended = (): boolean =>
    moment().unix() >=
    this.state.startedAt +
      Number(process.env.ROULETTE_SPIN_DURATION) +
      Number(process.env.ROULETTE_END_DURATION)

  @Expose({ groups: ['roulette'] })
  jackpotInstance = (): boolean => this.state.winningNumber === 15

  @Expose({ groups: ['coinflip'] })
  heads = (): boolean => {
    return this.state.side === 'heads'
  }

  @Expose({ groups: ['coinflip'] })
  tails = (): boolean => {
    return this.state.side === 'tails'
  }
}
