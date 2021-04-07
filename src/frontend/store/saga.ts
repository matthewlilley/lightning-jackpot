import {
  AVATAR,
  COLOR,
  DEPOSIT,
  LOAD_USER,
  NAME,
  SOCKET_CONNECT,
  SOCKET_DISCONNECT,
  TIP,
  WITHDRAW,
} from '../containers/app/constants'
import {
  LOAD_INSTANCE,
  LOAD_ROULETTE,
  PLACE_BET,
} from '../containers/roulette/constants'
import {
  addBet,
  addInstance,
  increaseJackpot,
  incrementBets,
  incrementSatoshi,
  incrementSpins,
  setDisabled,
  setInstance,
  setJackpot,
  updateInstance,
} from '../containers/roulette/actions'
import { addMessage, setOnline } from '../containers/chat/actions'
import {
  addTransaction,
  clearTransaction,
  increaseBalance,
  reduceBalance,
  setBalance,
  setOffset,
  setTransaction,
  setUser,
} from '../containers/app/actions'
import {
  all,
  call,
  cancel,
  fork,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects'
import { getInstance, getRoulette } from '../containers/roulette/saga'

import { SEND_MESSAGE } from '../containers/chat/constants'
import { change } from 'redux-form/immutable'
import chatSaga from '../containers/chat/saga'
import { eventChannel } from 'redux-saga'
import getConfig from 'next/config'
import { getUser } from '../containers/app/saga'
import { hide } from 'redux-modal'
import io from 'socket.io-client'
import { notification } from 'antd'

const {
  publicRuntimeConfig: { WS_URL, ROULETTE_JACKPOT_CUT },
} = getConfig()

function connect() {
  const socket = io(WS_URL, {
    transports: ['websocket'],
  })
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket)
    })
  })
}

function subscribe(socket) {
  return eventChannel(emit => {
    const blockedHandler = blocked => {
      // console.log('blocked');
    }
    socket.on('blocked', blockedHandler)

    const readyHandler = serverTimestamp => {
      // console.log('ready');
      const clientTimestamp = Date.now()
      // console.log('CLIENT TS: ', clientTimestamp);
      // console.log('SERVER TS: ', serverTimestamp);

      const offset = -(clientTimestamp - serverTimestamp)
      // console.log('OFFSET: ', offset);

      // console.log('CLIENT NOW + OFFSET', clientTimestamp + offset);
      emit(setOffset(offset))
    }
    socket.on('ready', readyHandler)

    // const nowHandler = serverTimestamp => {
    //   const clientTimestamp = Date.now();
    //   const offset = -(clientTimestamp - serverTimestamp);
    //   emit(setOffset(offset));
    // };
    // socket.on('now', nowHandler);

    const onlineHandler = online => {
      emit(setOnline(online))
    }
    socket.on('online', onlineHandler)

    const transactionCreatedHandler = transaction => {
      emit(setTransaction(transaction))
      emit(addTransaction(transaction))
    }
    socket.on('transactionCreated', transactionCreatedHandler)

    const transactionUpdatedHandler = transaction => {
      const deposit = transaction.type === 'deposit'
      const value = parseInt(transaction.value, 10)
      if (deposit) {
        emit(change('deposit', 'paymentRequest', ''))
        emit(increaseBalance(value))
      } else {
        emit(change('withdraw', 'paymentRequest', ''))
        emit(reduceBalance(value))
      }
      emit(hide(deposit ? 'deposit' : 'withdraw'))
      emit(clearTransaction())
      notification.success({
        message: `${deposit ? 'Deposit' : 'Withdrawal'} Success!`,
        description: `You successfully ${
          deposit ? 'deposited ' : 'withdrawn '
        } ${transaction.value} SAT!`,
      })
    }
    socket.on('transactionUpdated', transactionUpdatedHandler)

    const betCreatedHandler = bet => {
      emit(addBet(bet))
      emit(increaseJackpot(bet.value * ROULETTE_JACKPOT_CUT))
      emit(incrementBets())
      emit(incrementSatoshi(Number(bet.value)))
    }
    socket.on('betCreated', betCreatedHandler)

    const betSuccessHandler = bet => {
      // console.log('betSuccess', bet);
      emit(reduceBalance(bet.value))
      emit(addBet(bet))
      emit(increaseJackpot(bet.value * ROULETTE_JACKPOT_CUT))
      emit(incrementBets())
      emit(incrementSatoshi(Number(bet.value)))
    }
    socket.on('betSuccess', betSuccessHandler)

    const betErrorHandler = message => {
      console.log('betErrorHandler', message)
      notification.error({
        message,
      })
    }
    socket.on('betError', betErrorHandler)

    const instanceCreatedHandler = instance => {
      // console.log('instanceCreatedHandler', instance);
      emit(setDisabled(false))
      emit(addInstance())
      // emit(incrementSatoshi())
      emit(setInstance(instance))
      emit(incrementSpins())
    }
    socket.on('instanceCreated', instanceCreatedHandler)

    const instanceUpdatedHandler = instance => {
      // console.log('instanceUpdatedHandler', instance);
      emit(updateInstance(instance))
    }
    socket.on('instanceUpdated', instanceUpdatedHandler)

    const jackpotHandler = value => {
      emit(setJackpot({ value }))
    }
    socket.on('jackpotCreated', jackpotHandler)
    socket.on('jackpotUpdated', jackpotHandler)

    const messageHandler = message => {
      emit(addMessage(message))
    }
    socket.on('global', messageHandler)

    const userHandler = user => {
      emit(setUser(user))
    }
    socket.on('userUpdated', userHandler)

    const balanceHandler = balance => {
      emit(setBalance(balance))
    }
    socket.on('balanceUpdated', balanceHandler)

    const disconnectHandler = args => {
      console.log('disconnectHandler', args)
    }
    socket.on('disconnect', disconnectHandler)

    const errorHandler = message => {
      console.log('error', message)
      notification.error({
        message,
      })
    }
    socket.on('error', errorHandler)

    const infoHandler = message => {
      // console.log('infoHandler', message);
      notification.info({
        message,
      })
    }
    socket.on('info', infoHandler)

    const successHandler = message => {
      notification.success({
        message,
      })
    }
    socket.on('success', successHandler)

    const withdrawalFailedHandler = message => {
      emit(hide('withdrawal'))
      notification.error({
        message,
      })
    }
    socket.on('withdrawalFailed', withdrawalFailedHandler)

    const betFailedHandler = ({ message }) => {
      console.log('betFailedHandler', message)
      notification.error({
        message,
      })
    }
    socket.on('betFailed', betFailedHandler)

    const tipFailedHandler = message => {
      notification.error({
        message,
      })
    }
    socket.on('tipFailed', tipFailedHandler)

    const tipSuccessHandler = tip => {
      emit(hide('tip'))
      emit(
        reduceBalance(Number(tip.value) + Math.floor(Number(tip.value) * 0.025))
      )
      notification.success({
        message: tip.message,
      })
    }
    socket.on('tipSuccess', tipSuccessHandler)

    const tipRecievedHandler = tip => {
      console.log('tipRecieved', tip)
      emit(increaseBalance(Number(tip.value)))
      notification.success({
        message: `You recieved a tip of ${tip.value} SAT!`,
      })
    }
    socket.on('tipRecieved', tipRecievedHandler)

    const depositFailedHandler = deposit => {
      console.log('depositFailed', deposit)
      emit(hide('deposit'))
      notification.error({
        message: deposit,
      })
    }
    socket.on('depositFailed', depositFailedHandler)

    return () => {
      socket.off('blocked', blockedHandler)
      socket.off('ready', readyHandler)
      socket.off('online', onlineHandler)
      socket.off('transactionCreated', transactionCreatedHandler)
      socket.off('transactionUpdated', transactionUpdatedHandler)
      socket.off('betCreated', betCreatedHandler)
      socket.off('betSuccess', betSuccessHandler)
      socket.off('betError', betErrorHandler)
      socket.off('instanceCreated', instanceCreatedHandler)
      socket.off('instanceUpdated', instanceUpdatedHandler)
      socket.off('jackpotCreated', jackpotHandler)
      socket.off('jackpotUpdated', jackpotHandler)
      socket.off('global', messageHandler)
      socket.off('userUpdated', userHandler)
      socket.off('balanceUpdated', balanceHandler)
      socket.off('disconnect', disconnectHandler)
      socket.off('info', infoHandler)
      socket.off('success', successHandler)
      socket.off('withdrawalFailed', withdrawalFailedHandler)
      socket.off('betFailed', betFailedHandler)
      socket.off('tipFailed', tipFailedHandler)
      socket.off('tipSuccess', tipSuccessHandler)
      socket.off('tipRecieved', tipRecievedHandler)
      socket.off('depositFailed', depositFailedHandler)
    }
  })
}

// I - READ/INPUT
function* read(socket) {
  const channel = yield call(subscribe, socket)
  while (true) {
    const action = yield take(channel)
    // console.log('<-I', action);
    yield put(action)
  }
}

function* watchBet(socket) {
  while (true) {
    const { bet } = yield take(PLACE_BET)
    // console.log('[PLACE BET] O->', bet);
    socket.emit('bet', bet)
  }
}

function* watchMessage(socket) {
  while (true) {
    const { value } = yield take(SEND_MESSAGE)
    console.log('[SEND MESSAGE] O->', value)
    socket.emit('global', value)
  }
}

function* watchDeposit(socket) {
  while (true) {
    const { value } = yield take(DEPOSIT)
    console.log('[DEPOSIT] O->', { value })
    socket.emit('deposit', value)
  }
}

function* watchWithdraw(socket) {
  while (true) {
    const { paymentRequest } = yield take(WITHDRAW)
    console.log('[WITHDRAW] O->', { paymentRequest })
    socket.emit('withdraw', paymentRequest)
  }
}

function* watchName(socket) {
  while (true) {
    const { name } = yield take(NAME)
    console.log('[NAME] O->', { name })
    socket.emit('name', name)
  }
}

function* watchAvatar(socket) {
  while (true) {
    const { avatar } = yield take(AVATAR)
    console.log('[AVATAR] O->', { avatar })
    socket.emit('avatar', avatar)
  }
}

function* watchColor(socket) {
  while (true) {
    const { color } = yield take(COLOR)
    console.log('[COLOR] O->', { color })
    socket.emit('color', color)
  }
}

function* watchTip(socket) {
  while (true) {
    const { tip } = yield take(TIP)
    console.log('[TIP] O->', { tip })
    socket.emit('tip', tip)
  }
}

// O - WRITE/OUTPUT
function* write(socket) {
  yield all([
    call(watchBet, socket),
    call(watchMessage, socket),
    call(watchDeposit, socket),
    call(watchWithdraw, socket),
    call(watchName, socket),
    call(watchAvatar, socket),
    call(watchColor, socket),
    call(watchTip, socket),
  ])
}

function* handleSocketIo(socket) {
  yield fork(read, socket)
  yield fork(write, socket)
}

// function* runSocket() {
//   const socket = yield call(connect);
//   yield fork(handleSocketIo, socket);
// }

// function* watchSocket() {
//   while (yield take(SOCKET_CONNECT)) {
//     const task = yield fork(runSocket);
//     yield take(SOCKET_DISCONNECT);
//     yield cancel(task);
//   }

function* socketFlow() {
  while (true) {
    yield take(SOCKET_CONNECT)
    const socket = yield call(connect)
    // socket.emit('login');
    // socket.emit('login', { username: payload.username });

    const task = yield fork(handleSocketIo, socket)

    yield take(SOCKET_DISCONNECT)
    yield cancel(task)
    socket.emit('logout')
    socket.disconnect()
  }
}

function* runSocket() {
  yield fork(socketFlow)
}

// while (true) {
//   yield take(SOCKET_CONNECT);
//   yield race({
//     task: runSocket,
//     cancel: take(SOCKET_DISCONNECT)
//   })
// }
// }

function* rootSaga() {
  yield all([
    call(runSocket),
    call(chatSaga),
    takeLatest(LOAD_USER, getUser),
    takeLatest(LOAD_ROULETTE, getRoulette),
    takeLatest(LOAD_INSTANCE, getInstance),
  ])
}

export default rootSaga
