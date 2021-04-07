import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Balance } from '../balances'

@Entity()
export class Credit {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unsigned: true })
  value: number

  @Column()
  context: string

  @Column({ nullable: false })
  balanceId: number

  @ManyToOne(() => Balance, balance => balance.credits, { nullable: false })
  balance: Balance

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
