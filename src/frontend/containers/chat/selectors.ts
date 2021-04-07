import { createSelector } from "reselect";

export const selectChat = state => state.get("chat");

export const selectVisible = () =>
  createSelector(
    selectChat,
    chatState => chatState.get("visible")
  );

export const selectError = () =>
  createSelector(
    selectChat,
    chatState => chatState.get("error")
  );

export const selectLoading = () =>
  createSelector(
    selectChat,
    chatState => chatState.get("loading")
  );

export const selectMessages = () =>
  createSelector(
    selectChat,
    chatState => {
      const messages = chatState.get("messages");
      return messages ? messages.toJS() : [];
    }
  );

export const selectOnline = () =>
  createSelector(
    selectChat,
    chatState => chatState.get("online")
  );

export const selectRoom = () =>
  createSelector(
    selectChat,
    chatState => chatState.get("room")
  );
