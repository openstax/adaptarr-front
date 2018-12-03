import * as constants from '../constants'
import { User } from '../types'

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
