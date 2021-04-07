import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Balance } from '../balances'
import { GameMeta } from './game-meta.entity'
import { GameStatus } from './game-status'
import { Instance } from '../instances'
import { Jackpot } from '../jackpots'

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({
    type: 'json',
    nullable: true,
    select: false,
  })
  state: any

  @Column({
    type: 'enum',
    enum: GameStatus,
  })
  status: GameStatus

  @Column({ nullable: true })
  instanceId: number

  @OneToOne(() => Instance, instance => instance.game)
  @JoinColumn()
  instance: Instance

  @Column({ nullable: true })
  jackpotId: number

  @OneToOne(() => Jackpot, jackpot => jackpot.game)
  @JoinColumn()
  jackpot: Jackpot

  @OneToMany(() => Instance, instance => instance.game)
  instances: Instance[]

  @OneToMany(() => Jackpot, jackpot => jackpot.game)
  jackpots: Jackpot[]

  @OneToMany(() => GameMeta, meta => meta.game)
  meta: GameMeta[]

  @Column({ nullable: true })
  balanceId: number

  @OneToOne(() => Balance)
  @JoinColumn()
  balance: Balance

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
