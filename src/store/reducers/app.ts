import { AppAction } from 'src/store/actions/app'
import { SET_LOCALE, SET_AVAILABLE_LOCALES } from 'src/store/constants'

export interface State {
  locale: string[],
  availableLocales: string[],
}

export const initialState: State = {
  locale: Array.from(navigator.languages),
  availableLocales: [],
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

  default:
    return state
  }
}
