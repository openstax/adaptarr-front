import { UserDataAction } from '../actions/User'
import { User } from '../types'
import { 
  FETCH_USER_BEGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  CLEAR_USER_DATA
} from '../constants'

export interface State {
  user: User
}

export const initialState = {
  user: {
    isLoading: false,
    id: null,
    name: null,
    avatar: null,
    avatarSmall: null,
    role: null,
  }
}

export function reducer (state: State = initialState, action: UserDataAction) {
  switch (action.type) {
    case FETCH_USER_BEGIN:
      return {
        ...state,
        user: {
          ...state.user,
          isLoading: true,
        }
      }
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        user: {
          ...action.data,
          isLoading: false,
        }
      }
    case FETCH_USER_FAILURE:
      return {
        ...state,
        user: {
          ...state.user,
          isLoading: false,
          error: action.error,
        }
      }
    case CLEAR_USER_DATA:
      return {
        ...state,
        user: initialState.user
      }
  }
  return state
}
