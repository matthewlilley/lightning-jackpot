import {
  instanceLoaded,
  instanceLoadingError,
  rouletteLoaded,
  rouletteLoadingError,
} from './actions'

import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import { put } from 'redux-saga/effects'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

export function* getRoulette() {
  try {
    const response = yield fetch(`${APP_URL}/api/v0/roulette`)
    const data = yield response.json()
    yield put(rouletteLoaded(data))
  } catch (error) {
    console.log('ERROR LOADING ROULETTE INITIAL DATA', error)
    yield put(rouletteLoadingError(error))
  }
}

export function* getInstance(action) {
  try {
    console.log('getInstance', action.id)
    const response = yield fetch(`${APP_URL}/api/v0/instances/${action.id}`)
    const instance = yield response.json()
    yield put(instanceLoaded(instance))
  } catch (error) {
    console.log('ERROR LOADING INSTANCE DATA', error)
    yield put(instanceLoadingError(error))
  }
}
