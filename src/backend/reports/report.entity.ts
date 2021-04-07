import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  type: string;

  @Column({ default: 0 })
  EV2x: number;

  @Column({ default: 0 })
  EV14x: number;

  @Column({ default: 0 })
  totalEV: number;

  @Column({ default: 0 })
  value2x: number;

  @Column({ default: 0 })
  value14x: number;

  @Column({ default: 0 })
  totalValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
