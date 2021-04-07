import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PerformanceIndicator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  users: number;

  @Column('integer')
  depositVolume: number;

  @Column('integer')
  betVolume: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
