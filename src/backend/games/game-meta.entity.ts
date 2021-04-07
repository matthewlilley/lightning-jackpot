import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Game } from './game.entity'

@Entity()
export class GameMeta {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  key: string

  @Column('longtext')
  value: string

  @ManyToOne(() => Game, game => game.meta)
  @JoinTable()
  game: Game

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
