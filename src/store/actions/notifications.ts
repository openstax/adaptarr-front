import { Notification } from 'src/api'

import * as constants from 'src/store/constants'
import { NotificationStatus } from 'src/store/types'
import { addAlert } from './alerts'

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

export type NotificationsAction =
  FetchNotificationsBegin |
  FetchNotificationsSuccess |
  FetchNotificationsFailure |
  PushNotificationToStore |
  MarkNotificationAsRead |
  MarkNotificationAsUnRead

const fetchNotificationsBegin = (): FetchNotificationsBegin => ({
  type: constants.FETCH_NOTIFICATIONS_BEGIN,
})

const fetchNotificationsSuccess = (payload: Notification[]): FetchNotificationsSuccess => ({
  type: constants.FETCH_NOTIFICATIONS_SUCCESS,
  data: payload,
})

const fetchNotificationsFailure = (error: string): FetchNotificationsFailure => ({
  type: constants.FETCH_NOTIFICATIONS_FAILURE,
  error,
})

export const fetchNotifications = (): FetchNotifications => dispatch => {
  dispatch(fetchNotificationsBegin())

  Notification.unread()
    .then(res => {
      dispatch(fetchNotificationsSuccess(res))
    })
    .catch(e => {
      dispatch(fetchNotificationsFailure(e.message))
    })
}

export const pushNotificationToStore = (noti: Notification): PushNotificationToStore => ({
  type: constants.PUSH_NOTIFICATION_TO_STORE,
  data: noti,
})

export const changeNotificationStatus = (
  noti: Notification,
  status: NotificationStatus
): ChangeNotificationStatus => dispatch => {
  if (!noti.markRead) {
    noti = new Notification({ ...noti })
  }
  switch (status) {
  case 'read':
    noti.markRead()
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
    break

  default:
    break
  }
}

const markNotificationAsRead = (noti: Notification): MarkNotificationAsRead => ({
  type: constants.MARK_NOTIFICATION_AS_READ,
  data: noti,
})

const markNotificationAsUnRead = (noti: Notification): MarkNotificationAsUnRead => ({
  type: constants.MARK_NOTIFICATION_AS_UNREAD,
  data: noti,
})
