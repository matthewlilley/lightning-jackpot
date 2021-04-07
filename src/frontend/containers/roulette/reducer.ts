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
  SET_DISABLED,
  SET_INSTANCE,
  SET_JACKPOT,
  UPDATE_INSTANCE,
} from './constants'
import { List, Map, fromJS } from 'immutable'

import numeral from 'numeral'

// The initial state of the Roulette
export const initialState = fromJS({
  disabled: false,
  error: false,
  instance: {},
  instances: [],
  jackpot: {},
  loading: true,
  players: 0,
  satoshi: 0,
  spins: 0,
})

export function roulette(state = initialState, action) {
  switch (action.type) {
    case LOAD_ROULETTE:
      return state
        .set('disabled', false)
        .set('error', false)
        .set('instance', fromJS({}))
        .set('instances', fromJS([]))
        .set('jackpot', fromJS({}))
        .set('loading', true)
        .set('players', 0)
        .set('spins', 0)
        .set('satoshi', 0)

    case LOAD_ROULETTE_SUCCESS:
      return state
        .set('disabled', false)
        .set('error', false)
        .set('instance', fromJS(action.data.instance))
        .set('instances', fromJS(action.data.instances))
        .set('jackpot', fromJS(action.data.jackpot))
        .set('loading', false)
        .set('players', fromJS(action.data.players))
        .set('spins', fromJS(action.data.spins))
        .set('satoshi', fromJS(action.data.satoshi))
    // numeral(action.data.satoshi).format('0.00a')

    case LOAD_ROULETTE_ERROR:
      return state.set('error', action.error).set('loading', false)

    case LOAD_INSTANCE:
      return state
        .set('error', false)
        .set('instance', null)
        .set('loading', true)

    case LOAD_INSTANCE_SUCCESS:
      // console.log('Load instance success', action.instance);
      return state
        .set('instance', fromJS(action.instance))
        .set('loading', false)

    case LOAD_INSTANCE_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false)
        .set('loading', false)

    case ADD_BET:
      return state.updateIn(['instance', 'bets'], bets =>
        bets.push(fromJS(action.bet))
      )

    case SET_INSTANCE:
      return state.set('instance', fromJS(action.instance))

    case UPDATE_INSTANCE:
      return state.update('instance', instance => {
        return instance.merge(
          fromJS({
            ...action.instance,
          })
        )
      })

    case SET_JACKPOT:
      return state.set('jackpot', fromJS(action.jackpot))

    case INCREASE_JACKPOT:
      return state.updateIn(['jackpot', 'value'], v => v + action.value)

    case ADD_INSTANCE:
      return state.update('instances', array =>
        array.pop(array.length).unshift(state.get('instance'))
      )

    case SET_DISABLED:
      return state.set('disabled', fromJS(action.disabled))

    case INCREMENT_SPINS:
      return state.update('spins', count => count + 1)

    case INCREMENT_BETS:
      return state.update('betsCount', count => count + 1)

    case INCREMENT_SATOSHI:
      return state.update('satoshi', satoshi => {
        return Number(satoshi) + action.value
      })

    default:
      return state
  }
}
