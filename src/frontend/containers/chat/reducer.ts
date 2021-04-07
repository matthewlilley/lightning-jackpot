/*
 * ChatReducer
 */

import {
  ADD_MESSAGE,
  LOAD_MESSAGES,
  LOAD_MESSAGES_ERROR,
  LOAD_MESSAGES_SUCCESS,
  SET_CHAT,
  SET_ONLINE,
  SET_ROOM,
  TOGGLE_CHAT,
} from './constants'

import { fromJS } from 'immutable'
import moment from 'moment'

// The initial state of the App
const initialState = fromJS({
  chat: false,
  error: false,
  loading: true,
  messages: false,
  online: 0,
  room: false,
})

export function chat(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return state.update('messages', messages => {
        return messages.insert(messages.size, {
          ...action.message,
          id: moment().unix(),
        })
      })

    case LOAD_MESSAGES:
      return state
        .set('error', false)
        .set('loading', true)
        .set('messages', false)
        .set('online', 0)

    case LOAD_MESSAGES_ERROR:
      return state.set('error', action.error).set('loading', false)

    case LOAD_MESSAGES_SUCCESS:
      return state
        .set('messages', fromJS(action.messages))
        .set('loading', false)

    case SET_CHAT:
      return state.set('chat', action.data)

    case SET_ONLINE:
      return state.set('online', action.online)

    case SET_ROOM:
      return state.set('room', action.data)

    case TOGGLE_CHAT:
      return state.set('chat', !state.get('chat'))

    default:
      return state
  }
}
