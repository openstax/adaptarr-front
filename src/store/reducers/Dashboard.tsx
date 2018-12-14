import { IsLoading, Dashboard } from 'src/store/types'
import { DashboardDataAction } from 'src/store/actions/Dashboard'
import { 
  FETCH_DASHBOARD_BEGIN, 
  FETCH_DASHBOARD_SUCCESS, 
  FETCH_DASHBOARD_FAILURE,
} from 'src/store/constants'

export interface State {
  isLoading: IsLoading
  dashboard: Dashboard
  error?: string
}

// Define our initialState
export const initialState: State = {
  isLoading: true,
  dashboard: {
    assigned: [],
    drafts: [],
  },
}

export function reducer (state: State = initialState, action: DashboardDataAction) {
  switch (action.type) {
    case FETCH_DASHBOARD_BEGIN:
      return {
        ...state,
        isLoading: true,
        dashboard: state.dashboard,
      }
    case FETCH_DASHBOARD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        dashboard: action.data,
      }
    case FETCH_DASHBOARD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        dashboard: state.dashboard,
      }
  }
  return state
}
