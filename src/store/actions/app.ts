import { SET_LOCALE, SET_AVAILABLE_LOCALES, SET_ROLES, SET_PROCESSES } from 'src/store/constants'
import { Process, Role } from 'src/api'

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
  data: Process[],
}

export type AppAction = SetLocale | SetAvailableLocales | SetRoles | SetProcesses

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
    const processes = await Process.all()
    dispatch(setProcesses(processes))
  }
}

export const setProcesses = (processes: Process[]): SetProcesses => ({
  type: SET_PROCESSES,
  data: processes,
})
