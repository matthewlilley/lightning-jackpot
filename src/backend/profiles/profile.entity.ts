import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '../users'

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  providerId: string

  @Column()
  provider: string

  @Column({ nullable: true })
  userId: number

  @ManyToOne(type => User, user => user.profiles, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
