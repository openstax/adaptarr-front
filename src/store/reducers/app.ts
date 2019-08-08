import { AppAction, ConfirmDialogOptions } from 'src/store/actions/app'
import { SET_LOCALE, SET_AVAILABLE_LOCALES, SET_ROLES, SET_PROCESSES, SHOW_CONFIRM_DIALOG, CLOSE_CONFIRM_DIALOG } from 'src/store/constants'
import Role from 'src/api/role'
import Process from 'src/api/process'

export interface State {
  locale: string[],
  availableLocales: string[],
  roles: Role[],
  processes: Map<number, Process>,
  showConfirmDialog: boolean
  confirmDialogOptions: ConfirmDialogOptions
}

const DEFAULT_CONFIRM_DIALOG_OPTIONS = {
  title: 'confirm-dialog-title',
  content: '',
  buttons: {
    ok: 'cofirm-dialog-button-ok',
    cancel: 'cofirm-dialog-button-cancel',
  },
  callback: (key: string) => key,
}

export const initialState: State = {
  locale: Array.from(navigator.languages),
  availableLocales: [],
  roles: [],
  processes: new Map(),
  showConfirmDialog: false,
  confirmDialogOptions: DEFAULT_CONFIRM_DIALOG_OPTIONS,
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

  case SHOW_CONFIRM_DIALOG:
    return {
      ...state,
      showConfirmDialog: true,
      confirmDialogOptions: {
        title: action.data.title,
        content: action.data.content,
        buttons: action.data.buttons,
        callback: action.data.callback,
      },
    }

  case CLOSE_CONFIRM_DIALOG:
    return {
      ...state,
      showConfirmDialog: false,
      confirmDialogOptions: DEFAULT_CONFIRM_DIALOG_OPTIONS,
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
