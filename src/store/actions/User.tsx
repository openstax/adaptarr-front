import axios from 'src/config/axios'

import * as constants from 'src/store/constants'
import { User } from 'src/store/types'

export interface FetchUser {
  (dispatch: any): void
}

export interface FetchUserBegin { 
  type: constants.FETCH_USER_BEGIN,
}

export interface FetchUserSuccess { 
  type: constants.FETCH_USER_SUCCESS,
  data: User,
}

export interface FetchUserFailure { 
  type: constants.FETCH_USER_FAILURE,
  error: string,
}

export interface ClearUserData {
  type: constants.CLEAR_USER_DATA,
}

export type UserDataAction = FetchUserBegin | FetchUserSuccess | FetchUserFailure | ClearUserData

const fetchUserBegin = (): FetchUserBegin => {
  return {
    type: constants.FETCH_USER_BEGIN,
  }
}

const fetchUserSuccess = (payload: User): FetchUserSuccess => {
  return {
    type: constants.FETCH_USER_SUCCESS,
    data: payload,
  }
}

const fetchUserFailure = (error: string): FetchUserFailure => {
  return {
    type: constants.FETCH_USER_FAILURE,
    error,
  }
}

export const fetchUser = () => {
  return (dispatch: React.Dispatch<UserDataAction>) => {
    
    dispatch(fetchUserBegin())

    axios.get('users/me')
      .then(res => {
        dispatch(fetchUserSuccess(res.data))
      })
      .catch(e => {
        dispatch(fetchUserFailure(e.message))
        dispatch(clearUserData())
        window.location.href = `/login?next=${window.location.pathname}`
      })
  }
}

export const clearUserData = (): ClearUserData => {
  return {
    type: constants.CLEAR_USER_DATA,
  }
}
