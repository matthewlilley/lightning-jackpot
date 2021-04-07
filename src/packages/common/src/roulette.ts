export type Bear = 'Bear'
export type Moon = 'Moon'
export type Bull = 'Bull'
// export type Lightning = 'Lightning'
// export type BetType = Bear | Moon | Bull;
// export type WinningType = Bear | Moon | Bull | Lightning;

export enum BetType {
  Bear,
  Moon,
  Bull,
}

export enum WinningType {
  Bear = 'Bear',
  Moon = 'Moon',
  Bull = 'Bull',
  Lightning = 'Lightning',
}

type WinningNumber =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15

const { Moon, Bear, Bull, Lightning } = WinningType

const numberType: { [index: number]: WinningType } = {
  0: Moon,
  1: Bear,
  2: Bull,
  3: Bear,
  4: Bull,
  5: Bear,
  6: Bull,
  7: Bear,
  8: Bull,
  9: Bear,
  10: Bull,
  11: Bear,
  12: Bull,
  13: Bear,
  14: Bull,
  15: Lightning,
}

export const winningNumberToType = (winningNumber: number): string => {
  return numberType[winningNumber]
}

enum Preset {
  normal,
  teaser,
  jackpot,
}

export interface RouletteState {
  preset?: Preset
  startedAt: number
  winningNumber?: number
  winningType?: string
}

export interface RouletteBetState {
  type: string
}

import { IsIn } from 'class-validator'

export class RouletteBetState {
  @IsIn(['Bear', 'Moon', 'Bull'])
  type: string
}

export interface Instance {
  state: RouletteState
}

export const jackpotInstance: (instance: Instance) => boolean = (
  instance: Instance
) => instance.state.winningNumber === 15

const multipliers: { [index: string]: number } = {
  Bear: 2,
  Moon: 14,
  Bull: 2,
}

export const multiplier: (type: string) => number = (type: string) =>
  multipliers[type]

export const outcome: (
  type: string,
  value: number,
  winner: boolean,
  instanceValue: number,
  jackpot: boolean,
  jackpotValue: number
) => number = (
  type,
  value,
  winner,
  instanceValue,
  jackpot,
  jackpotValue = 0
) => {
  if (!winner && !jackpot) {
    return -value
  }
  return jackpot
    ? value + jackpotValue * (value / instanceValue)
    : value * multiplier(type)
}
