import { UserDataAction } from '../actions/User'
import { IsLoading, User } from '../types'
import { 
  FETCH_USER_BEGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  CLEAR_USER_DATA,
} from '../constants'

export interface State {
  isLoading: IsLoading
  user: User
  error?: string
}

export const initialState = {
  isLoading: true,
  user: {
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
