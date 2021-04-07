import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Instance } from './instance.entity';

@Entity()
export class InstanceMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column('longtext')
  value: string;

  @ManyToOne(() => Instance, instance => instance.meta, {
    onDelete: 'CASCADE'
  })
  instance: Instance;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
