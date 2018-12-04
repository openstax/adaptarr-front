import { combineReducers } from 'redux'

import * as fromDashboard from './Dashboard'
import * as fromUser from './User'
import * as fromNotifications from './Notifications'

/*
 * This is the root state of the app
 * It contains every substate of the app
 */
export interface State {
  dashboard: fromDashboard.State
  user: fromUser.State
  notifications: fromNotifications.State
}

/*
 * initialState of the app
 */
export const initialState: State = {
  dashboard: fromDashboard.initialState,
  user: fromUser.initialState,
  notifications: fromNotifications.initialState,
}

/*
 * Root reducer of the app
 * Returned reducer will be of type Reducer<State>
 */
export const reducer = combineReducers<State>({
  dashboard: fromDashboard.reducer,
  user: fromUser.reducer,
  notifications: fromNotifications.reducer,
})
