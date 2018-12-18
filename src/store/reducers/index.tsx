import { combineReducers } from 'redux'

import * as fromUser from './User'
import * as fromTeam from './Team'
import * as fromNotifications from './Notifications'
import * as fromBooks from './Books'
import * as fromModules from './Modules'
import * as fromAlerts from './Alerts'

/*
 * This is the root state of the app
 * It contains every substate of the app
 */
export interface State {
  user: fromUser.State
  team: fromTeam.State
  notifications: fromNotifications.State
  booksMap: fromBooks.State
  modules: fromModules.State
  alerts: fromAlerts.State
}

/*
 * initialState of the app
 */
export const initialState: State = {
  user: fromUser.initialState,
  team: fromTeam.initialState,
  notifications: fromNotifications.initialState,
  booksMap: fromBooks.initialState,
  modules: fromModules.initialState,
  alerts: fromAlerts.initialState,
}

/*
 * Root reducer of the app
 * Returned reducer will be of type Reducer<State>
 */
export const reducer = combineReducers<State>({
  user: fromUser.reducer,
  team: fromTeam.reducer,
  notifications: fromNotifications.reducer,
  booksMap: fromBooks.reducer,
  modules: fromModules.reducer,
  alerts: fromAlerts.reducer,
})
