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
export class Debit {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unsigned: true })
  value: number

  @Column()
  context: string

  @Column({ nullable: false })
  balanceId: number

  @ManyToOne(() => Balance, balance => balance.debits, { nullable: false })
  balance: Balance

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
