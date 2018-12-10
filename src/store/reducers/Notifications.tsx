import { NotificationsAction } from '../actions/Notifications'
import { IsLoading, Notification } from '../types'
import { 
  FETCH_NOTIFICATIONS_BEGIN,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
} from '../constants'

export interface State {
  isLoading: IsLoading
  notifications: Notification[]
  error?: string
}

export const initialState = {
  isLoading: false,
  notifications: [],
}

export function reducer (state: State = initialState, action: NotificationsAction) {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_BEGIN:
      return {
        ...state,
        isLoading: true,
        notifications: state.notifications,
      }
    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        notifications: action.data,
      }
    case FETCH_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        notifications: state.notifications,
      }
  }
  return state
}
