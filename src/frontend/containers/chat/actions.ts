import {
  ADD_MESSAGE,
  ADD_TIP,
  LOAD_MESSAGES,
  LOAD_MESSAGES_ERROR,
  LOAD_MESSAGES_SUCCESS,
  SEND_MESSAGE,
  SET_CHAT,
  SET_ONLINE,
  SET_ROOM,
  TOGGLE_CHAT,
} from './constants';

export function addTip(tip) {
  return {
    type: ADD_TIP,
    tip,
  };
}

export function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    message,
  };
}

export function loadMessages() {
  return {
    type: LOAD_MESSAGES,
  };
}

export function messagesLoaded(messages) {
  return {
    type: LOAD_MESSAGES_SUCCESS,
    messages,
  };
}

export function messagesLoadingError(error) {
  return {
    type: LOAD_MESSAGES_ERROR,
    error,
  };
}

export function setChat(data) {
  return {
    type: SET_CHAT,
    data,
  };
}

export function setOnline(online) {
  return {
    type: SET_ONLINE,
    online,
  };
}

export function setRoom(data) {
  return {
    type: SET_ROOM,
    data,
  };
}

export function toggleChat() {
  return { type: TOGGLE_CHAT };
}

export function sendMessage(value) {
  return { type: SEND_MESSAGE, value };
}
