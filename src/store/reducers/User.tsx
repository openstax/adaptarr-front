import { UserDataAction } from '../actions'
import { User } from '../types'
import { SET_USER_DATA, CLEAR_USER_DATA } from '../constants'

export interface State {
  user: User
}

export const initialState = {
  user: {
    id: 0,
    name: 'initial'
  }
}

export function reducer (state: State = initialState, action: UserDataAction) {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        user: action.data
      }
    case CLEAR_USER_DATA:
      return {
        ...state,
        user: {}
      }
  }
  return state
}
