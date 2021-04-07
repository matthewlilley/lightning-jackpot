import { promisify } from 'util'

export const sleep = promisify(setTimeout)

export * from './roulette'

export * from './strategies'

export interface User {
  avatar: string
  color: string
  name: string
}

export interface Bet {
  type: string
  user: User
  value: number
}

export interface Message {
  id: number
  user: User
  value: string
}

export enum InstanceStatus {
  default = 'default',
  live = 'live',
  complete = 'complete',
}

export enum ServiceStatus {
  online = 'online',
  offline = 'offline',
}

export enum GameStatus {
  offline,
  online,
}
