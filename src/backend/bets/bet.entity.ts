import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsNumber, IsPositive } from 'class-validator'

import { Instance } from '../instances'
import { RouletteBetState } from '@lightning-jackpot/common'
import { User } from '../users'

type State = RouletteBetState & CoinflipBetState

interface CoinflipBetState {
  side: 'heads' | 'tails'
}

@Entity()
export class Bet {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unsigned: true })
  @IsNumber()
  @IsPositive()
  value: number

  @Column({ nullable: true })
  outcome: number

  @Column({
    type: 'json',
    nullable: false,
  })
  state: State

  @Column()
  instanceId: number

  @ManyToOne(() => Instance, (instance: Instance) => instance.bets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  instance: Instance

  @Column()
  userId: number

  @ManyToOne(() => User, (user: User) => user.bets, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
