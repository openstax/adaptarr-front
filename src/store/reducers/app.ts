import { AppAction, ConfirmDialogOptions } from 'src/store/actions/app'
import {
  CLOSE_CONFIRM_DIALOG,
  SET_AVAILABLE_LOCALES,
  SET_LOCALE,
  SET_PROCESSES,
  SET_SELECTED_TEAMS,
  SET_TEAM,
  SET_TEAMS,
  SHOW_CONFIRM_DIALOG,
} from 'src/store/constants'

import { Process } from 'src/api'
import { TeamsMap } from 'src/store/types'

export interface State {
  locale: string[]
  availableLocales: string[]
  processes: Map<number, Process>
  showConfirmDialog: boolean
  confirmDialogOptions: ConfirmDialogOptions
  teams: TeamsMap
  selectedTeams: number[]
}

const DEFAULT_CONFIRM_DIALOG_OPTIONS: ConfirmDialogOptions = {
  title: 'confirm-dialog-title',
  content: '',
  buttons: {
    ok: 'confirm-dialog-button-ok',
    cancel: 'confirm-dialog-button-cancel',
  },
  callback: (key: string) => key,
}

export const initialState: State = {
  locale: Array.from(navigator.languages),
  availableLocales: [],
  processes: new Map(),
  showConfirmDialog: false,
  confirmDialogOptions: DEFAULT_CONFIRM_DIALOG_OPTIONS,
  teams: new Map(),
  selectedTeams: [],
}

// eslint-disable-next-line default-param-last
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

  case SET_PROCESSES:
    return {
      ...state,
      processes: action.data,
    }

  case SHOW_CONFIRM_DIALOG:
    return {
      ...state,
      showConfirmDialog: true,
      confirmDialogOptions: action.data,
    }

  case CLOSE_CONFIRM_DIALOG:
    return {
      ...state,
      showConfirmDialog: false,
      confirmDialogOptions: DEFAULT_CONFIRM_DIALOG_OPTIONS,
    }

  case SET_TEAM:
    return {
      ...state,
      teams: new Map(state.teams.set(action.data.id, action.data)),
    }

  case SET_TEAMS:
    return {
      ...state,
      teams: action.data,
    }

  case SET_SELECTED_TEAMS:
    return {
      ...state,
      selectedTeams: action.data,
    }

  default:
    return state
  }
}
