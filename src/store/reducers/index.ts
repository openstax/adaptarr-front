import { combineReducers } from 'redux'

import * as fromApp from './app'
import * as fromUser from './user'
import * as fromNotifications from './notifications'
import * as fromBooks from './books'
import * as fromModules from './modules'
import * as fromAlerts from './alerts'
import * as fromConversations from './conversations'
import * as fromDrafts from './drafts'

// This is the root state of the app
// It contains every substate of the app
export interface State {
  app: fromApp.State
  user: fromUser.State
  notifications: fromNotifications.State
  booksMap: fromBooks.State
  modules: fromModules.State
  alerts: fromAlerts.State
  conversations: fromConversations.State
  draft: fromDrafts.State
}

// initialState of the app
export const initialState: State = {
  app: fromApp.initialState,
  user: fromUser.initialState,
  notifications: fromNotifications.initialState,
  booksMap: fromBooks.initialState,
  modules: fromModules.initialState,
  alerts: fromAlerts.initialState,
  conversations: fromConversations.initialState,
  draft: fromDrafts.initialState,
}

// Root reducer of the app
// Returned reducer will be of type Reducer<State>
export const reducer = combineReducers<State>({
  app: fromApp.reducer,
  user: fromUser.reducer,
  notifications: fromNotifications.reducer,
  booksMap: fromBooks.reducer,
  modules: fromModules.reducer,
  alerts: fromAlerts.reducer,
  conversations: fromConversations.reducer,
  draft: fromDrafts.reducer,
})
