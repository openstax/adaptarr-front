import { Notification } from 'src/api'

import { NotificationsAction } from 'src/store/actions/Notifications'
import { IsLoading } from 'src/store/types'
import {
  FETCH_NOTIFICATIONS_BEGIN,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  PUSH_NOTIFICATION_TO_STORE,
  MARK_NOTIFICATION_AS_READ,
  MARK_NOTIFICATION_AS_UNREAD,
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
      let newUnreadNoti = [...state.unreadNotifications]
      newUnreadNoti.push(action.data)
      return {
        ...state,
        unreadNotifications: newUnreadNoti
      }
    case MARK_NOTIFICATION_AS_READ:
      let newUnreadNotiRead = [...state.unreadNotifications]
      const indexToRemove = newUnreadNotiRead.findIndex(el => el.id === action.data.id)
      if (indexToRemove >= 0) {
        newUnreadNotiRead.splice(indexToRemove, 1)
      }
      return {
        ...state,
        unreadNotifications: newUnreadNotiRead
      }
    case MARK_NOTIFICATION_AS_UNREAD:
      // TODO: Add some logic here - waiting for api endpoint for notifications with "read" status
      return state
  }
  return state
}
