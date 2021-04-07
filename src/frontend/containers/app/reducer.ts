import {
  ADD_TRANSACTION,
  AVATAR,
  CLEAR_TRANSACTION,
  COLOR,
  INCREASE_BALANCE,
  LOAD_USER,
  LOAD_USER_ERROR,
  LOAD_USER_SUCCESS,
  REDUCE_BALANCE,
  SET_BALANCE,
  SET_OFFSET,
  SET_SIDEBAR,
  SET_TIP_RECIPIENT,
  SET_TRANSACTION,
  SET_USER,
  SET_WEBLN,
  TOGGLE_SIDEBAR,
  UPDATE_USER,
} from './constants'

import { fromJS } from 'immutable'

// The initial state of the App
const initialState = fromJS({
  sidebar: false,
  error: false,
  game: 'roulette',
  loading: true,
  offset: 0,
  theme: 'light',
  transaction: false,
  transactions: [],
  user: false,
  webln: false,
  tipRecipient: null,
})

/* tslint:disable */
export function app(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER:
      return state.update('user', user => {
        return user.merge(fromJS(action.user))
      })

    case SET_SIDEBAR:
      return state.set('sidebar', action.sidebar)

    case TOGGLE_SIDEBAR:
      return state.set('sidebar', !state.get('sidebar'))

    case ADD_TRANSACTION:
      console.log('ADD_TRANSACTION', action.transaction)
      return state.update('transactions', transactions =>
        transactions.push(fromJS(action.transaction))
      )

    case COLOR:
      return state.setIn(['user', 'color'], action.color)

    case AVATAR:
      return state.setIn(['user', 'avatar'], action.avatar)

    case LOAD_USER:
      return state
        .set('loading', true)
        .set('error', false)
        .set('user', false)

    case LOAD_USER_SUCCESS:
      return state.set('user', fromJS(action.user)).set('loading', false)

    case LOAD_USER_ERROR:
      return state.set('error', action.error).set('loading', false)

    case INCREASE_BALANCE:
      return state.updateIn(['user', 'balance', 'value'], v => v + action.value)

    case SET_OFFSET:
      return state.set('offset', action.offset)

    case REDUCE_BALANCE:
      return state.updateIn(['user', 'balance', 'value'], v => v - action.value)

    case SET_TIP_RECIPIENT:
      return state.set('tipRecipient', action.tipRecipient)

    case SET_TRANSACTION:
      return state.set('transaction', fromJS(action.transaction))

    case CLEAR_TRANSACTION:
      return state.set('transaction', false)

    case SET_USER:
      return state.set('user', fromJS(action.user))

    case SET_WEBLN:
      return state.set('webln', action.webln)

    case SET_BALANCE:
      return state.setIn(['user', 'balance'], action.balance)

    default:
      return state
  }
}
