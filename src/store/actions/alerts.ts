import { Notification } from 'src/api'

import { validateL20nArgs } from 'src/helpers'

import { PUSH_ALERT, REMOVE_ALERT } from 'src/store/constants'
import { Alert, AlertDataKind } from 'src/store/types'
import { pushNotificationToStore, PushNotificationToStore } from './notifications'

export interface AddAlert {
  (dispatch: any): void
}

export interface AddNotification {
  (dispatch: any): void
}

export interface PushAlert {
  type: PUSH_ALERT,
  data: Alert,
}

export interface RemoveAlert {
  type: REMOVE_ALERT,
  data: Alert,
}

export type AlertsAction = PushAlert | RemoveAlert

export const addAlert = (kind: AlertDataKind, message: string, args: object = {}): AddAlert => {
  return (dispatch: React.Dispatch<AlertsAction>) => {
    const alert: Alert = {
      id: new Date().getTime(),
      kind: 'alert',
      data: {
        kind,
        message,
        arguments: validateL20nArgs(args),
      },
    }

    dispatch(pushAlert(alert))

    // Do not hide alert with error messages.
    if (kind !== 'error') {
      setTimeout(() => {
        dispatch(removeAlert(alert))
      }, 7000)
    }
  }
}

export const addNotification = (data: Notification): AddNotification => {
  return (dispatch: React.Dispatch<AlertsAction | PushNotificationToStore>) => {
    const alert: Alert = {
      id: new Date().getTime(),
      kind: 'notification',
      data,
    }

    dispatch(pushAlert(alert))
    dispatch(pushNotificationToStore(data))
    setTimeout(() => {
      dispatch(removeAlert(alert))
    }, 5000)
  }
}

export const pushAlert = (alert: Alert): PushAlert => {
  return {
    type: PUSH_ALERT,
    data: alert,
  }
}

export const removeAlert = (alert: Alert): RemoveAlert => {
  return {
    type: REMOVE_ALERT,
    data: alert,
  }
}
