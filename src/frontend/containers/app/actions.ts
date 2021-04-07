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
  ADD_TRANSACTION,
  AVATAR,
  CLEAR_TRANSACTION,
  COLOR,
  DEPOSIT,
  INCREASE_BALANCE,
  LOAD_USER,
  LOAD_USER_ERROR,
  LOAD_USER_SUCCESS,
  NAME,
  REDUCE_BALANCE,
  SET_BALANCE,
  SET_OFFSET,
  SET_SIDEBAR,
  SET_TIP_RECIPIENT,
  SET_TRANSACTION,
  SET_USER,
  SET_WEBLN,
  SOCKET_CONNECT,
  SOCKET_DISCONNECT,
  TIP,
  TOGGLE_SIDEBAR,
  UPDATE_USER,
  WITHDRAW,
} from './constants';

export function setSidebar(sidebar) {
  return {
    type: SET_SIDEBAR,
    sidebar,
  };
}

export function addTransaction(transaction) {
  return {
    type: ADD_TRANSACTION,
    transaction,
  };
}

export function setColor(color) {
  return { type: COLOR, color };
}

export function clearTransaction() {
  return {
    type: CLEAR_TRANSACTION,
  };
}

export function deposit(value) {
  return { type: DEPOSIT, value };
}

export function loadUser() {
  return {
    type: LOAD_USER,
  };
}

export function userLoadingError(error) {
  return {
    type: LOAD_USER_ERROR,
    error,
  };
}

export function userLoaded(user) {
  return {
    type: LOAD_USER_SUCCESS,
    user,
  };
}

export function increaseBalance(value) {
  return {
    type: INCREASE_BALANCE,
    value,
  };
}

export function reduceBalance(value) {
  return {
    type: REDUCE_BALANCE,
    value,
  };
}

export function setName(name) {
  return {
    type: NAME,
    name,
  };
}

export function setAvatar(avatar) {
  return {
    type: AVATAR,
    avatar,
  };
}

export function setOffset(offset) {
  return {
    type: SET_OFFSET,
    offset,
  };
}

export function setBalance(balance) {
  return {
    type: SET_BALANCE,
    balance,
  };
}

export function setTransaction(transaction) {
  return {
    type: SET_TRANSACTION,
    transaction,
  };
}

export function setUser(user) {
  return {
    type: SET_USER,
    user,
  };
}

export function setWebLN(webln) {
  return { type: SET_WEBLN, webln };
}

export function socketConnect() {
  return {
    type: SOCKET_CONNECT,
  };
}

export function socketDisconnect() {
  return {
    type: SOCKET_DISCONNECT,
  };
}

export function tip(tip) {
  return { type: TIP, tip };
}

export function updateUser(user) {
  return {
    type: UPDATE_USER,
    user,
  };
}

export function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR,
  };
}

export function withdraw(paymentRequest) {
  return { type: WITHDRAW, paymentRequest };
}

export function setTipRecipient(tipRecipient) {
  return { type: SET_TIP_RECIPIENT, tipRecipient };
}
