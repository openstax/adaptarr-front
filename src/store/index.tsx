import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { State, reducer, initialState } from 'src/store/reducers'

const logger = () => {
  return (next: any) => {
    return (action: any) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Middleware] Dispatching', action)
      }
      next(action)
    }
  }
}

const store = createStore<State, any, any, any>(reducer, initialState, applyMiddleware(logger, thunk))

export default store