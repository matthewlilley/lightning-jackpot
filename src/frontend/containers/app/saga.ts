import { userLoaded, userLoadingError } from './actions'

import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import { put } from 'redux-saga/effects'
import { show } from 'redux-modal'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

export function* getUser() {
  try {
    console.log('getUser')
    const res = yield fetch(`${APP_URL}/api/v0/me`)
    const user = yield res.json()
    // if (!user.name) {
    //   yield put(show('name'));
    // }
    yield put(userLoaded(user))
  } catch (error) {
    yield put(userLoadingError(error))
  }
}
