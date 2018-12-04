import { NotificationsAction } from '../actions/Notifications'
import { Notifications } from '../types'
import { 
  FETCH_NOTIFICATIONS_BEGIN,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
} from '../constants'

export interface State {
  notifications: Notifications
}

export const initialState = {
  notifications: {
    isLoading: false,
    notifications: [],
  }
}

export function reducer (state: State = initialState, action: NotificationsAction) {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_BEGIN:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          isLoading: true,
        }
      }
    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: {
          notifications: action.data,
          isLoading: false,
        }
      }
    case FETCH_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          isLoading: false,
          error: action.error,
        }
      }
  }
  return state
}
