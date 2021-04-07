/**
 * Gets the messages
 */

import { messagesLoaded, messagesLoadingError, setOnline } from './actions'
import { put, select, takeLatest } from 'redux-saga/effects'

import { LOAD_MESSAGES } from './constants'
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import { selectRoom } from './selectors'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

/**
 * Get the messages.
 */
export function* getMessages() {
  // const room = yield select(selectRoom());
  try {
    // const response = yield fetch(`${APP_URL}/api/v0/messages/${room}`);
    const response = yield fetch(`${APP_URL}/api/v0/messages`)
    const { messages, online } = yield response.json()
    yield put(messagesLoaded(messages))
    yield put(setOnline(online))
  } catch (error) {
    yield put(messagesLoadingError(error))
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* chatSaga() {
  // Watches for LOAD_MESSAGES actions and calls getMessages when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(LOAD_MESSAGES, getMessages)
}
