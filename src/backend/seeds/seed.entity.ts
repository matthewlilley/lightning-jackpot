import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Instance } from '../instances';

@Entity()
export class Seed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  @OneToMany(() => Instance, instance => instance.seedPair)
  instance: Instance[];

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
