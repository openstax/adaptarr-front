import User from 'src/api/user'

import { UserDataAction } from 'src/store/actions/user'
import { IsLoading, UsersMap } from 'src/store/types'
import {
  CLEAR_USER_DATA,
  FETCH_USER_BEGIN,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS,
  SET_USER_IN_USERS_MAP,
  SET_USERS_MAP,
} from 'src/store/constants'

export interface State {
  isLoading: IsLoading
  user: User
  error?: string
  users: UsersMap
}

export const initialState = {
  isLoading: true,
  user: new User({
    id: 0,
    name: 'Loading...',
    language: 'en',
    is_super: false,
    is_support: false,
    teams: [],
  }),
  users: new Map(),
}

// eslint-disable-next-line default-param-last
export function reducer(state: State = initialState, action: UserDataAction) {
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
      user: initialState.user,
    }

  case SET_USERS_MAP:
    return {
      ...state,
      users: action.data,
    }

  case SET_USER_IN_USERS_MAP: {
    const usersMapAfter = state.users
    usersMapAfter.set(action.data.id, new User({ ...action.data }))
    return {
      ...state,
      users: usersMapAfter,
    }
  }

  default:
    return state
  }
}
