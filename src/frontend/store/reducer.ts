import { app } from '../containers/app/reducer'
import { chat } from '../containers/chat/reducer'
import { combineReducers } from 'redux-immutable'
import { reducer as form } from 'redux-form/immutable'
import { reducer as modal } from 'redux-modal'
import { roulette } from '../containers/roulette/reducer'

export default combineReducers({
  app,
  chat,
  form,
  modal,
  roulette,
})
