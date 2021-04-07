/**
 * Roulette selectors
 */

import { createSelector } from 'reselect'
import { fromJS } from 'immutable'
import { initialState } from './reducer'
import numeral from 'numeral'

export const selectRoulette = state => state.get('roulette', initialState)

export const selectLoading = () =>
  createSelector(selectRoulette, rouletteState => rouletteState.get('loading'))

export const selectInstance = () =>
  createSelector(selectRoulette, rouletteState => rouletteState.get('instance'))

export const selectInstanceValue = () =>
  createSelector(selectRoulette, rouletteState =>
    rouletteState.getIn(['instance', 'value'])
  )

export const selectInstances = () =>
  createSelector(selectRoulette, rouletteState =>
    rouletteState.get('instances')
  )

export const selectJackpot = () =>
  createSelector(selectRoulette, rouletteState => rouletteState.get('jackpot'))

export const selectJackpotInstance = () =>
  createSelector(
    selectRoulette,
    rouletteState =>
      rouletteState.getIn(['instance', 'state', 'winningNumber']) === 15
  )

export const selectJackpotValue = () =>
  createSelector(selectRoulette, rouletteState =>
    numeral(rouletteState.getIn(['jackpot', 'value'])).format('0.00a')
  )

export const selectStartedAt = () =>
  createSelector(selectRoulette, rouletteState =>
    rouletteState.getIn(['instance', 'state', 'startedAt'])
  )

export const selectWinningNumber = () =>
  createSelector(selectRoulette, rouletteState =>
    rouletteState.getIn(['instance', 'state', 'winningNumber'])
  )

export const selectWinningType = () =>
  createSelector(selectRoulette, rouletteState =>
    rouletteState.getIn(['instance', 'state', 'winningType'])
  )

export const selectBets = () =>
  createSelector(selectRoulette, rouletteState =>
    rouletteState.hasIn(['instance', 'bets'])
      ? rouletteState.getIn(['instance', 'bets'])
      : fromJS([])
  )

export const selectDisabled = () =>
  createSelector(selectRoulette, rouletteState => rouletteState.get('disabled'))

export const selectPlayers = () =>
  createSelector(selectRoulette, rouletteState => rouletteState.get('players'))

export const selectSpins = () =>
  createSelector(selectRoulette, rouletteState => rouletteState.get('spins'))

export const selectSatoshi = () =>
  createSelector(selectRoulette, rouletteState =>
    numeral(rouletteState.get('satoshi')).format('0.00a')
  )

export const selectWaiting = () =>
  createSelector(
    selectRoulette,
    rouletteState =>
      rouletteState.hasIn(['instance', 'bets']) &&
      rouletteState.getIn(['instance', 'bets']).size === 0
  )

export const selectSpinning = () =>
  createSelector(
    selectRoulette,
    rouletteState =>
      rouletteState.hasIn(['instance', 'spinning']) &&
      rouletteState.getIn(['instance', 'spinning'])
  )

export const selectSpun = () =>
  createSelector(
    selectRoulette,
    rouletteState =>
      rouletteState.hasIn(['instance', 'spun']) &&
      rouletteState.getIn(['instance', 'spun'])
  )

export const selectCountdownDuration = () =>
  createSelector(selectRoulette, rouletteState =>
    rouletteState.getIn(['instance', 'countdownDuration'])
  )

export const selectSpinDuration = () =>
  createSelector(selectRoulette, rouletteState =>
    rouletteState.getIn(['instance', 'spinDuration'])
  )

export const selectEndDuration = () =>
  createSelector(selectRoulette, rouletteState =>
    rouletteState.getIn(['instance', 'endDuration'])
  )

export const selectEnded = () =>
  createSelector(selectRoulette, rouletteState =>
    rouletteState.getIn(['instance', 'ended'])
  )

// const selectBets = () =>
//   createSelector(
//     selectRoulette,
//     rouletteState =>
//       rouletteState
//         .getIn(['round', 'bets'])
//         .reduce(
//           (a, b) => a.set(b.get('type'), a.get(b.get('type')).push(b)),
//           fromJS({ Bear: [], Moon: [], Bull: [] }),
//         ),
//   );
