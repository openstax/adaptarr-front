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
      let alertsAfterAdd = state.alerts
      alertsAfterAdd.push(action.data)
      return {
        ...state,
        alerts: alertsAfterAdd,
      }
    case REMOVE_ALERT:
      let alertsAfterRemove = state.alerts
      const indexToRemove = alertsAfterRemove.map(el => el.id).indexOf(action.data.id)
      if (indexToRemove || indexToRemove === 0) {
        alertsAfterRemove.splice(indexToRemove, 1)
      }
      return {
        ...state,
        alerts: alertsAfterRemove,
      }
  }
  return state
}
