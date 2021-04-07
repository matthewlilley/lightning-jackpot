import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {
  TransactionMeta,
  TransactionStatus,
  TransactionType,
} from '../transactions'

import { User } from '../users'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType

  @Column({ unsigned: true })
  value: number

  // @Index({ unique: true })
  // @Column({ type: 'text', length: 4096 })
  @Column('text')
  paymentRequest: string

  @Column()
  userId: number

  @ManyToOne(
    () => User,
    user => user.transactions,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn()
  user: User

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.Pending,
  })
  status: TransactionStatus

  @OneToMany(
    () => TransactionMeta,
    meta => meta.transaction
  )
  meta: TransactionMeta[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
