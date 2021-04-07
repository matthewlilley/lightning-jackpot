import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column('longtext')
  value: string;

  @ManyToOne(() => User, user => user.meta, {
    onDelete: 'CASCADE'
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
