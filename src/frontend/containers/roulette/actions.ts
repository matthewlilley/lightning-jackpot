/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  ADD_BET,
  ADD_INSTANCE,
  INCREASE_JACKPOT,
  INCREMENT_BETS,
  INCREMENT_SATOSHI,
  INCREMENT_SPINS,
  LOAD_INSTANCE,
  LOAD_INSTANCE_ERROR,
  LOAD_INSTANCE_SUCCESS,
  LOAD_ROULETTE,
  LOAD_ROULETTE_ERROR,
  LOAD_ROULETTE_SUCCESS,
  PLACE_BET,
  SET_DISABLED,
  SET_INSTANCE,
  SET_JACKPOT,
  UPDATE_INSTANCE,
} from './constants'

export function loadRoulette() {
  return {
    type: LOAD_ROULETTE,
  }
}

export function rouletteLoaded(data) {
  return {
    type: LOAD_ROULETTE_SUCCESS,
    data,
  }
}

export function rouletteLoadingError(error) {
  return {
    type: LOAD_ROULETTE_ERROR,
    error,
  }
}

export function loadInstance(id) {
  console.log('load instance')
  return { type: LOAD_INSTANCE, id }
}

export function instanceLoaded(instance) {
  console.log('instance loaded')
  return {
    type: LOAD_INSTANCE_SUCCESS,
    instance,
  }
}

export function instanceLoadingError(error) {
  console.log('round loading error')
  return {
    type: LOAD_INSTANCE_ERROR,
    error,
  }
}

export function placeBet(bet) {
  return {
    type: PLACE_BET,
    bet,
  }
}

export function addBet(bet) {
  return {
    type: ADD_BET,
    bet,
  }
}

export function addInstance() {
  return {
    type: ADD_INSTANCE,
  }
}

export function setInstance(instance) {
  return {
    type: SET_INSTANCE,
    instance,
  }
}

export function updateInstance(instance) {
  return {
    type: UPDATE_INSTANCE,
    instance,
  }
}

export function setJackpot(jackpot) {
  return {
    type: SET_JACKPOT,
    jackpot,
  }
}

export function increaseJackpot(value) {
  return {
    type: INCREASE_JACKPOT,
    value,
  }
}

export function setDisabled(disabled) {
  return {
    type: SET_DISABLED,
    disabled,
  }
}

export function incrementSpins() {
  return {
    type: INCREMENT_SPINS,
  }
}

export function incrementBets() {
  return {
    type: INCREMENT_BETS,
  }
}

export function incrementSatoshi(value) {
  return {
    type: INCREMENT_SATOSHI,
    value,
  }
}
