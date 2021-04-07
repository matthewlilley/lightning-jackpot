import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Game } from '../games'
import { Instance } from '../instances'

@Entity()
export class Jackpot {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: 1337, unsigned: true })
  value: number

  @Column({ nullable: true })
  instanceId: number

  @OneToOne(() => Instance, instance => instance.jackpot, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  instance: Instance

  @Column()
  gameId: number

  @ManyToOne(() => Game, game => game.jackpots, {
    onDelete: 'CASCADE',
  })
  game: Game

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
