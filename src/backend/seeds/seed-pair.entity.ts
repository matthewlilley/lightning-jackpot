import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Instance } from '../instances'
import { Seed } from '../seeds'

@Entity()
export class SeedPair {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  serverSeedId: number

  @OneToOne(() => Seed, {
    cascade: true,
  })
  @JoinColumn()
  serverSeed: Seed

  @Column()
  clientSeedId: number

  @OneToOne(() => Seed, {
    cascade: true,
  })
  @JoinColumn()
  clientSeed: Seed

  @OneToMany(() => Instance, instance => instance.seedPair)
  instances: Instance[]

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
