import axios from '../../config/axios'

import * as constants from '../constants'
import { Dashboard } from '../types'

export interface FetchDashboard {
  (dispatch: any): void
}

export interface FetchDashboardBegin {
  type: constants.FETCH_DASHBOARD_BEGIN
}

export interface FetchDashboardSuccess {
  type: constants.FETCH_DASHBOARD_SUCCESS,
  data: Dashboard,
}

export interface FetchDashboardFailure {
  type: constants.FETCH_DASHBOARD_FAILURE,
  error: string,
}

export type DashboardDataAction = FetchDashboardBegin | FetchDashboardSuccess | FetchDashboardFailure

const fetchDashboardBegin = (): FetchDashboardBegin => {
  return {
    type: constants.FETCH_DASHBOARD_BEGIN,
  }
}

const fetchDashboardSuccess = (payload: Dashboard): FetchDashboardSuccess => {
  return {
    type: constants.FETCH_DASHBOARD_SUCCESS,
    data: payload,
  }
}

const fetchDashboardFailure = (error: string): FetchDashboardFailure => {
  return {
    type: constants.FETCH_DASHBOARD_FAILURE,
    error,
  }
}

export const fetchDashboard = (): FetchDashboard => {
  return (dispatch: React.Dispatch<DashboardDataAction>) => {
    
    dispatch(fetchDashboardBegin())

    axios.get('dashboard')
      .then(res => {
        dispatch(fetchDashboardSuccess(res.data))
      })
      .catch(e => {
        dispatch(fetchDashboardFailure(e.message))
      })
  }
}