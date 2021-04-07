import { createSelector } from 'reselect'

export const selectApp = state => state.get('app')

export const selectSidebar = () =>
  createSelector(
    selectApp,
    globalState => globalState.get('sidebar')
  )

export const selectError = () =>
  createSelector(
    selectApp,
    globalState => globalState.get('error')
  )

export const selectGame = () =>
  createSelector(
    selectApp,
    globalState => globalState.get('game')
  )

export const selectLoading = () =>
  createSelector(
    selectApp,
    globalState => globalState.get('loading')
  )

export const selectOffset = () =>
  createSelector(
    selectApp,
    globalState => globalState.get('offset')
  )

export const selectTheme = () =>
  createSelector(
    selectApp,
    globalState => globalState.get('theme')
  )

export const selectTransaction = () =>
  createSelector(
    selectApp,
    globalState => {
      const transaction = globalState.get('transaction')
      return transaction ? transaction.toJS() : false
    }
  )

export const selectUser = () =>
  createSelector(
    selectApp,
    globalState => globalState.get('user')
  )

export const selectUsername = () =>
  createSelector(
    selectApp,
    globalState => globalState.getIn(['user', 'name'])
  )

export const selectColor = () =>
  createSelector(
    selectApp,
    globalState => globalState.getIn(['user', 'color'])
  )

export const selectWebLN = () =>
  createSelector(
    selectApp,
    globalState => globalState.get('webln')
  )

export const selectBalance = () =>
  createSelector(
    selectApp,
    globalState => globalState.getIn(['user', 'balance', 'value'])
  )

export const selectTipRecipient = () =>
  createSelector(
    selectApp,
    globalState => globalState.get('tipRecipient')
  )
