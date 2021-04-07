import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Credit, Debit } from '../accounting'

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unsigned: true, default: 0 })
  value: number

  @OneToMany(() => Credit, credit => credit.balance)
  credits: Credit[]

  @OneToMany(() => Debit, debit => debit.balance)
  debits: Debit[]

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
