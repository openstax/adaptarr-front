import { PUSH_ALERT, REMOVE_ALERT } from 'src/store/constants'
import { Alert, AlertKind } from 'src/store/types'

export interface AddAlert {
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

export const addAlert = (kind: AlertKind, message: string): AddAlert => {
  return (dispatch: React.Dispatch<AlertsAction>) => {
    const alert: Alert = {
      id: new Date().getTime(),
      kind,
      message,
    }

    dispatch(pushAlert(alert))
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
