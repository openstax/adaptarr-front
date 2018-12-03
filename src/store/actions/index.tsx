import axios from '../../config/axios'

import * as constants from '../constants'
import { User, Dashboard } from '../types'

// User Actions

export interface SetUserData { 
  type: constants.SET_USER_DATA,
  data: User,
}

export interface ClearUserData {
  type: constants.CLEAR_USER_DATA
}

export type UserDataAction = SetUserData | ClearUserData

export function setUserData (payload: User): SetUserData {
  return {
    type: constants.SET_USER_DATA,
    data: {name: payload.name},
  }
}

export function clearUserData (): ClearUserData {
  return {
    type: constants.CLEAR_USER_DATA
  }
}

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
