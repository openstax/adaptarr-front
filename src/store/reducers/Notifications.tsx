import { NotificationsAction } from 'src/store/actions/Notifications'
import { IsLoading, Notification } from 'src/store/types'
import { 
  FETCH_NOTIFICATIONS_BEGIN,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  PUSH_NOTIFICATION_TO_STORE,
} from 'src/store/constants'

export interface State {
  isLoading: IsLoading
  unreadNotifications: Notification[]
  error?: string
}

export const initialState = {
  isLoading: false,
  unreadNotifications: [],
}

export function reducer (state: State = initialState, action: NotificationsAction) {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_BEGIN:
      return {
        ...state,
        isLoading: true,
        unreadNotifications: state.unreadNotifications,
      }
    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        unreadNotifications: action.data,
      }
    case FETCH_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        unreadNotifications: state.unreadNotifications,
      }
    case PUSH_NOTIFICATION_TO_STORE:
      state.unreadNotifications.push(action.data)
      return state
  }
  return state
}
