import { User } from 'src/api'

import * as constants from 'src/store/constants'

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

    User.me()
      .then(user => {
        if (user === null) {
          window.location.href = `/login?next=${window.location.pathname}`
        } else {
          dispatch(fetchUserSuccess(user))
        }
      })
      .catch(e => {
        dispatch(fetchUserFailure(e.message))
        dispatch(clearUserData())
      })
  }
}

export const clearUserData = (): ClearUserData => {
  return {
    type: constants.CLEAR_USER_DATA,
  }
}
