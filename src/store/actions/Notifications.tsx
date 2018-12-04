import axios from '../../config/axios'

import * as constants from '../constants'
import { Notification } from '../types'

export interface FetchNotifications {
  (dispatch: any): void
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

export type NotificationsAction = FetchNotificationsBegin | FetchNotificationsSuccess | FetchNotificationsFailure

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
