import {
  SET_LOCALE,
  SET_AVAILABLE_LOCALES,
  SET_PROCESSES,
  SHOW_CONFIRM_DIALOG,
  CLOSE_CONFIRM_DIALOG,
  SET_SELECTED_TEAMS,
  SET_TEAM,
  SET_TEAMS,
} from 'src/store/constants'
import { addAlert, AddAlert } from 'src/store/actions/Alerts'
import { TeamsMap } from 'src/store/types'

import { Process, Team } from 'src/api'

import Button from 'src/components/ui/Button'

export interface SetLocale {
  type: SET_LOCALE,
  data: string[],
}

export interface SetAvailableLocales {
  type: SET_AVAILABLE_LOCALES,
  data: string[],
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

export interface FetchTeams {
  (dispatch: any): void
}

export interface SetTeam {
  type: SET_TEAM
  data: Team
}

export interface SetTeams {
  type: SET_TEAMS
  data: TeamsMap
}

export interface SetSelectedTeams {
  type: SET_SELECTED_TEAMS
  data: number[]
}

export type AppAction = SetLocale | SetAvailableLocales | SetProcesses | ShowConfirmDialog | CloseConfirmDialog | SetTeam | SetTeams | SetSelectedTeams

export const setLocale = (locale: string[]): SetLocale => ({
  type: SET_LOCALE,
  data: locale,
})

export const setAvailableLocales = (locales: string[]): SetAvailableLocales => ({
  type: SET_AVAILABLE_LOCALES,
  data: locales,
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

export const fetchTeams = (): FetchTeams => {
  return async (dispatch: React.Dispatch<SetTeams | AddAlert>) => {
    await Team.all()
      .then(teams => {
        dispatch(setTeams(teams))
      })
      .catch(() => {
        dispatch(addAlert('error', 'teams-error-fetch'))
      })
  }
}

export const setTeam = (team: Team): SetTeam => {
  return {
    type: SET_TEAM,
    data: team,
  }
}

export const setTeams = (teams: Team[] | TeamsMap): SetTeams => {
  const teamMap = teams instanceof Map ? teams : new Map(teams.map(t => ([t.id, t])))
  return {
    type: SET_TEAMS,
    data: teamMap,
  }
}

export const setSelectedTeams = (teams: number[]): SetSelectedTeams => {
  localStorage.setItem('selectedTeams', JSON.stringify(teams))
  return {
    type: SET_SELECTED_TEAMS,
    data: teams,
  }
}
