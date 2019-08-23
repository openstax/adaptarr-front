import { Alert } from 'src/store/types'
import { AlertsAction } from 'src/store/actions/Alerts'
import {
  PUSH_ALERT,
  REMOVE_ALERT,
} from 'src/store/constants'

export interface State {
  alerts: Alert[]
}

export const initialState: State = {
  alerts: []
}

export function reducer (state: State = initialState, action: AlertsAction) {
  switch (action.type) {
    case PUSH_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.data],
      }
    case REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(a => a.id !== action.data.id),
      }
  }
  return state
}
