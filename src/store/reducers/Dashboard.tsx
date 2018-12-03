import { Dashboard } from '../types'
import { DashboardDataAction } from '../actions/Dashboard'
import { 
  FETCH_DASHBOARD_BEGIN, 
  FETCH_DASHBOARD_SUCCESS, 
  FETCH_DASHBOARD_FAILURE,
} from '../constants'

export interface State {
  dashboard: Dashboard
}

// Define our initialState
export const initialState: State = {
  dashboard: {
    isLoading: false,
    books: [],
    assigned: [],
    drafts: [],
  }
}

export function reducer (state: State = initialState, action: DashboardDataAction) {
  switch (action.type) {
    case FETCH_DASHBOARD_BEGIN:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          isLoading: true,
        },
      }
    case FETCH_DASHBOARD_SUCCESS:
      return {
        ...state,
        dashboard: {
          ...action.data,
          isLoading: false,
        },
      }
    case FETCH_DASHBOARD_FAILURE:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          isLoading: false,
          error: action.error,
        },
      }
  }
  return state
}
