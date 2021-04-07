import { applyMiddleware, compose, createStore } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { fromJS } from 'immutable'
import rootReducer from './reducer'
import rootSaga from './saga'

const sagaMiddleware = createSagaMiddleware(/* {sagaMonitor} */)

const logger = createLogger({ stateTransformer: state => state.toJS() })

// const bindMiddleware = middleware => {
//   if (process.env.NODE_ENV !== 'production') {
//     return composeWithDevTools(applyMiddleware(...middleware));
//   }
//   return applyMiddleware(...middleware);
// };

export const makeStore = (initialState = {}, options) => {
  // const middleware = [sagaMiddleware];
  // if (!options.isServer) {
  //   middleware.push(logger);
  // }
  const store: any = createStore(
    rootReducer,
    fromJS(initialState),
    // bindMiddleware(middleware),
    // applyMiddleware(sagaMiddleware),
    composeWithDevTools(
      applyMiddleware(...[sagaMiddleware])
      // other store enhancers if any
    )
  )

  store.sagaTask = sagaMiddleware.run(rootSaga)

  return store
}

export default makeStore
