import { AppAction } from 'src/store/actions/app'
import { SET_LOCALE, SET_AVAILABLE_LOCALES, SET_ROLES } from 'src/store/constants'
import Role from 'src/api/role'

export interface State {
  locale: string[],
  availableLocales: string[],
  roles: Role[],
}

export const initialState: State = {
  locale: Array.from(navigator.languages),
  availableLocales: [],
  roles: [],
}

export function reducer(state: State = initialState, action: AppAction) {
  switch (action.type) {
  case SET_LOCALE:
    return {
      ...state,
      locale: action.data,
    }

  case SET_AVAILABLE_LOCALES:
    return {
      ...state,
      availableLocales: action.data,
    }

  case SET_ROLES:
    return {
      ...state,
      roles: action.data.sort(sortRoles),
    }

  default:
    return state
  }
}

const sortRoles = (a: Role, b: Role) => {
  if (a.id > b.id) {
    return 1
  } else if (a.id < b.id) {
    return -1
  } else {
    return 0
  }
}
