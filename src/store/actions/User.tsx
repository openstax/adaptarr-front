import User, { UserData } from 'src/api/user'

import * as constants from 'src/store/constants'
import { UsersMap } from 'src/store/types'

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

export interface FetchUsersMap {
  (dispatch: any): void
}

export interface SetUsersMap {
  type: constants.SET_USERS_MAP,
  data: UsersMap,
}

export interface SetUserInUsersMap {
  type: constants.SET_USER_IN_USERS_MAP,
  data: UserData,
}

export interface UpdateUserInUsersMap {
  (dispatch: any): void
}

export type UserDataAction = FetchUserBegin | FetchUserSuccess | FetchUserFailure | ClearUserData | SetUsersMap | SetUserInUsersMap

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

export const fetchUsersMap = (): FetchUsersMap => {
  return (dispatch: React.Dispatch<UserDataAction>) => {
    User.all()
      .then(users => {
        dispatch(setUsersMap(new Map(users.map((user: User): [number, User] => [user.id, user]))))
      })
      .catch(e => {
        console.log('fetchUsersMap():', e.message)
        throw new Error(e.message)
      })
  }
}

export const setUsersMap = (payload: UsersMap): SetUsersMap => {
  return {
    type: constants.SET_USERS_MAP,
    data: payload,
  }
}

export const setUserInUsersMap = (payload: UserData): SetUserInUsersMap => {
  return {
    type: constants.SET_USER_IN_USERS_MAP,
    data: payload,
  }
}

export const updateUserInUsersMap = (userData: UserData): UpdateUserInUsersMap => {
  return (dispatch: React.Dispatch<UserDataAction>) => {
    dispatch(setUserInUsersMap(userData))
  }
}
