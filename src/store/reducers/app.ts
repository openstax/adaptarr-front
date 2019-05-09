import { AppAction } from 'src/store/actions/app'
import { SET_LOCALE, SET_AVAILABLE_LOCALES, SET_ROLES, SET_PROCESSES } from 'src/store/constants'
import Role from 'src/api/role'
import Process from 'src/api/process'

export interface State {
  locale: string[],
  availableLocales: string[],
  roles: Role[],
  processes: Map<number, Process>,
}

export const initialState: State = {
  locale: Array.from(navigator.languages),
  availableLocales: [],
  roles: [],
  processes: new Map(),
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
  
  case SET_PROCESSES:
    return {
      ...state,
      processes: action.data,
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
