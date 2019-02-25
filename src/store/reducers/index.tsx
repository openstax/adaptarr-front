import { combineReducers } from 'redux'

import * as fromApp from './app'
import * as fromUser from './User'
import * as fromTeam from './Team'
import * as fromNotifications from './Notifications'
import * as fromBooks from './Books'
import * as fromModules from './Modules'
import * as fromAlerts from './Alerts'
import * as fromConvcersations from './Conversations'

/*
 * This is the root state of the app
 * It contains every substate of the app
 */
export interface State {
  app: fromApp.State
  user: fromUser.State
  team: fromTeam.State
  notifications: fromNotifications.State
  booksMap: fromBooks.State
  modules: fromModules.State
  alerts: fromAlerts.State
  conversation: fromConvcersations.State
}

/*
 * initialState of the app
 */
export const initialState: State = {
  app: fromApp.initialState,
  user: fromUser.initialState,
  team: fromTeam.initialState,
  notifications: fromNotifications.initialState,
  booksMap: fromBooks.initialState,
  modules: fromModules.initialState,
  alerts: fromAlerts.initialState,
  conversation: fromConvcersations.initialState,
}

/*
 * Root reducer of the app
 * Returned reducer will be of type Reducer<State>
 */
export const reducer = combineReducers<State>({
  app: fromApp.reducer,
  user: fromUser.reducer,
  team: fromTeam.reducer,
  notifications: fromNotifications.reducer,
  booksMap: fromBooks.reducer,
  modules: fromModules.reducer,
  alerts: fromAlerts.reducer,
  conversation: fromConvcersations.reducer,
})
