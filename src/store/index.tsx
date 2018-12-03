import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { State, reducer, initialState } from './reducers'

const logger = () => {
  return (next: any) => {
    return (action: any) => {
      console.log('[Middleware] Dispatching', action)
      next(action)
    }
  }
}

const store = createStore<State, any, any, any>(reducer, initialState, applyMiddleware(logger, thunk))

export default store