import axios from 'src/config/axios'

import * as constants from 'src/store/constants'
import { Notification } from 'src/store/types'

export interface FetchNotifications {
  (dispatch: any): void
}

export interface PushNotificationToStore {
  type: constants.PUSH_NOTIFICATION_TO_STORE,
  data: Notification,
}

export interface FetchNotificationsBegin {
  type: constants.FETCH_NOTIFICATIONS_BEGIN
}

export interface FetchNotificationsSuccess {
  type: constants.FETCH_NOTIFICATIONS_SUCCESS,
  data: Notification[],
}

export interface FetchNotificationsFailure {
  type: constants.FETCH_NOTIFICATIONS_FAILURE,
  error: string,
}

export type NotificationsAction = FetchNotificationsBegin | FetchNotificationsSuccess | FetchNotificationsFailure | PushNotificationToStore

const fetchNotificationsBegin = (): FetchNotificationsBegin => {
  return {
    type: constants.FETCH_NOTIFICATIONS_BEGIN,
  }
}

const fetchNotificationsSuccess = (payload: Notification[]): FetchNotificationsSuccess => {
  return {
    type: constants.FETCH_NOTIFICATIONS_SUCCESS,
    data: payload,
  }
}

const fetchNotificationsFailure = (error: string): FetchNotificationsFailure => {
  return {
    type: constants.FETCH_NOTIFICATIONS_FAILURE,
    error,
  }
}

export const fetchNotifications = (): FetchNotifications => {
  return (dispatch: React.Dispatch<NotificationsAction>) => {
    
    dispatch(fetchNotificationsBegin())

    axios.get('notifications')
      .then(res => {
        dispatch(fetchNotificationsSuccess(res.data))
      })
      .catch(e => {
        dispatch(fetchNotificationsFailure(e.message))
      })
  }
}

export const pushNotificationToStore = (noti: Notification): PushNotificationToStore => {
  return {
    type: constants.PUSH_NOTIFICATION_TO_STORE,
    data: noti,
  }
}
