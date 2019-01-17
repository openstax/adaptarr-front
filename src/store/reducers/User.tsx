import User from 'src/api/user'

import { UserDataAction } from 'src/store/actions/User'
import { IsLoading } from 'src/store/types'
import {
  FETCH_USER_BEGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  CLEAR_USER_DATA,
} from 'src/store/constants'

export interface State {
  isLoading: IsLoading
  user: User
  error?: string
}

export const initialState = {
  isLoading: true,
  user: new User({
    id: 0,
    name: 'Loading...'
  })
}

export function reducer (state: State = initialState, action: UserDataAction) {
  switch (action.type) {
    case FETCH_USER_BEGIN:
      return {
        ...state,
        isLoading: true,
        user: state.user,
      }
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.data,
      }
    case FETCH_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        user: state.user,
      }
    case CLEAR_USER_DATA:
      return {
        ...state,
        user: initialState.user
      }
  }
  return state
}
