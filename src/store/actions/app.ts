import {
  SET_LOCALE,
  SET_AVAILABLE_LOCALES,
  SET_ROLES, SET_PROCESSES,
  SHOW_CONFIRM_DIALOG,
  CLOSE_CONFIRM_DIALOG,
} from 'src/store/constants'
import { Process, Role } from 'src/api'

import Button from 'src/components/ui/Button'

export interface SetLocale {
  type: SET_LOCALE,
  data: string[],
}

export interface SetAvailableLocales {
  type: SET_AVAILABLE_LOCALES,
  data: string[],
}

export interface FetchRoles {
  (dispatch: any): void
}

export interface SetRoles {
  type: SET_ROLES,
  data: Role[],
}

export interface FetchProcesses {
  (dispatch: any): void
}

export interface SetProcesses {
  type: SET_PROCESSES,
  data: Map<number, Process>,
}

export type ConfirmDialogOptions = {
  title: string
  buttons?: {[key: string]: string | typeof Button}
  size?: 'small' | 'medium' | 'big'
  content?: string | JSX.Element
  buttonsPosition?: 'default' | 'center' | 'start' | 'end'
  showCloseButton?: boolean
  closeOnBgClick?: boolean
  closeOnEsc?: boolean
  callback?: (key: string) => any
  [localizationProps: string]: any
}

export interface ShowConfirmDialog {
  type: SHOW_CONFIRM_DIALOG
  data: ConfirmDialogOptions
}

export interface CloseConfirmDialog {
  type: CLOSE_CONFIRM_DIALOG
}

export type AppAction = SetLocale | SetAvailableLocales | SetRoles | SetProcesses | ShowConfirmDialog | CloseConfirmDialog

export const setLocale = (locale: string[]): SetLocale => ({
  type: SET_LOCALE,
  data: locale,
})

export const setAvailableLocales = (locales: string[]): SetAvailableLocales => ({
  type: SET_AVAILABLE_LOCALES,
  data: locales,
})

export const fetchRoles = (): FetchRoles => {
  return async (dispatch: React.Dispatch<SetRoles>) => {
    const roles = await Role.all()
    dispatch(setRoles(roles))
  }
}

export const setRoles = (roles: Role[]): SetRoles => ({
  type: SET_ROLES,
  data: roles,
})

export const fetchProcesses = (): FetchProcesses => {
  return async (dispatch: React.Dispatch<SetProcesses>) => {
    const data = await Process.all()
    const processes = new Map(data.map((p): [number, Process] => [p.id, p]))
    dispatch(setProcesses(processes))
  }
}

export const setProcesses = (processes: Map<number, Process>): SetProcesses => ({
  type: SET_PROCESSES,
  data: processes,
})

export const showConfirmDialog = (options: ConfirmDialogOptions): ShowConfirmDialog => ({
  type: SHOW_CONFIRM_DIALOG,
  data: options,
})

export const closeConfirmDialog = (): CloseConfirmDialog => ({
  type: CLOSE_CONFIRM_DIALOG,
})
