import axios from 'src/config/axios'

import * as constants from 'src/store/constants'
import { Notification, NotificationStatus } from 'src/store/types'
import { addAlert, AddAlert } from './Alerts'

export interface FetchNotifications {
  (dispatch: any): void
}

export interface ChangeNotificationStatus {
  (dispatch: any): void
}

export interface PushNotificationToStore {
  type: constants.PUSH_NOTIFICATION_TO_STORE,
  data: Notification,
}

export interface MarkNotificationAsRead {
  type: constants.MARK_NOTIFICATION_AS_READ,
  data: Notification,
}

export interface MarkNotificationAsUnRead {
  type: constants.MARK_NOTIFICATION_AS_UNREAD,
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

export type NotificationsAction = FetchNotificationsBegin | FetchNotificationsSuccess | FetchNotificationsFailure | PushNotificationToStore | MarkNotificationAsRead | MarkNotificationAsUnRead

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
  return dispatch => {
    
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

export const changeNotificationStatus = (noti: Notification, status: NotificationStatus): ChangeNotificationStatus => {
  return dispatch => {
    switch (status) {
      case 'read':
        axios.put(`notifications/${noti.id}`, {unread: false})
          .then(() => {
            dispatch(markNotificationAsRead(noti))
          })
          .catch(e => {
            dispatch(addAlert('error', e.message))
          })
        break
      case 'unread':
        dispatch(markNotificationAsUnRead(noti))
        // TODO: Add api endpoint for 'unread' status
      default:
        break
    }
  }
}

const markNotificationAsRead = (noti: Notification): MarkNotificationAsRead => {
  return {
    type: constants.MARK_NOTIFICATION_AS_READ,
    data: noti,
  }
}

const markNotificationAsUnRead = (noti: Notification): MarkNotificationAsUnRead => {
  return {
    type: constants.MARK_NOTIFICATION_AS_UNREAD,
    data: noti,
  }
}
