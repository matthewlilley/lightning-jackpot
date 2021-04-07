import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {
  IsDefined,
  IsEmail,
  IsHexColor,
  IsString,
  Length,
} from 'class-validator'

import { Balance } from '../balances'
import { Bet } from '../bets'
import { EmailExists } from '../validators'
import { NameExists } from '../validators'
import { Profile } from '../profiles'
import { Role } from '../roles'
import { Tag } from '../tags'
import { Tip } from '../tips'
import { Transaction } from '../transactions'
import { UserMeta } from '../users'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ select: true })
  @Generated('uuid')
  uuid: string

  @Column({ default: '#6b46c1' })
  @IsHexColor()
  color: string

  @Column({ default: null, nullable: true, unique: true })
  @IsString()
  @Length(1, 20)
  // @NameExists({
  //   message: 'Name $value already exists. Choose another name.',
  // })
  name: string

  @Column({ default: null })
  avatar: string

  // @Column({ default: null })
  // @Length(1, 20)
  // @UsernameExists({
  //   message: 'User $value already exists. Choose another name.',
  // })
  // name: string;

  @Column({ default: null, unique: true })
  @IsEmail()
  @IsDefined()
  @EmailExists({
    message: 'Email $value already exists. Choose another email.',
  })
  email: string

  // @Column({ default: 0, unsigned: true })
  // balance: number

  @OneToMany(
    () => Bet,
    (bet: Bet) => bet.user,
    {
      cascade: true,
    }
  )
  bets: Bet[]

  @OneToMany(
    () => Tip,
    (tip: Tip) => tip.tipper || tip.recipient,
    {
      cascade: true,
    }
  )
  tips: Tip[]

  @OneToMany(
    () => Transaction,
    (transaction: Transaction) => transaction.user,
    {
      cascade: true,
    }
  )
  transactions: Transaction[]

  @OneToMany(
    () => UserMeta,
    (meta: UserMeta) => meta.user,
    {
      cascade: true,
    }
  )
  meta: UserMeta[]

  @Column()
  balanceId: number

  @OneToOne(() => Balance, { cascade: ['insert'] })
  @JoinColumn()
  balance: Balance

  @Column({ nullable: true })
  tagId: number

  @ManyToOne(
    () => Tag,
    tag => tag.users,
    { nullable: true }
  )
  @JoinColumn()
  tag: Tag

  @ManyToMany(() => Role, { eager: true })
  @JoinTable()
  roles: Role[]

  @OneToMany(
    () => Profile,
    (profile: Profile) => profile.user
  )
  profiles: Profile[]

  @Column({ default: false, select: false })
  locked: boolean

  @Column({
    type: 'json',
    nullable: true,
    select: false,
  })
  preferences: { tipVerb: string }

  @CreateDateColumn({ select: false })
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date

  registered() {
    return this.email !== null
  }

  lock() {
    this.locked = true
    return this
  }

  unlock() {
    this.locked = false
    return this
  }
}
