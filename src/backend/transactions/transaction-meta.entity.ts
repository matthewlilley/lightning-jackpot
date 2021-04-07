import {
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from '../transactions';

@Entity()
export class TransactionMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column('longtext')
  value: string;

  @ManyToOne(() => Transaction, transaction => transaction.meta, {
    onDelete: 'CASCADE'
  })
  @JoinTable()
  transaction: Transaction;
}
