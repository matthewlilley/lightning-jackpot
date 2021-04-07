import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'bigint', unsigned: true })
  value: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
