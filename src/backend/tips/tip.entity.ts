import { IsIn, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users';

@Entity()
export class Tip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unsigned: true })
  @IsNumber()
  value: number;

  @Column({ unsigned: true })
  fee: number;

  @Column()
  tipperId: number;

  @ManyToOne(() => User, (tipper: User) => tipper.tips, {
    cascade: ['update'],
  })
  @JoinColumn()
  tipper: User;

  @Column()
  recipientId: number;

  @ManyToOne(() => User, (recipient: User) => recipient.tips, {
    cascade: ['update'],
  })
  @JoinColumn()
  recipient: User;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
