import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

import { initialState, reducer, State } from 'src/store/reducers'

const logger = () => (next: any) => (action: any) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[Middleware] Dispatching', action)
  }
  next(action)
}

const store = createStore<State, any, any, any>(
  reducer,
  initialState,
  applyMiddleware(logger, thunk)
)

export default store
