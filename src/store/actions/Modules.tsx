import axios from 'src/config/axios'

import * as constants from 'src/store/constants'
import { ModulesMap, ModuleShortInfo } from 'src/store/types'

export interface FetchModulesMap {
  (dispatch: any): void
}

export interface SetModulesMap {
  type: constants.SET_MODULES_MAP,
  data: ModulesMap,
}

export interface AddModuleToMap {
  type: constants.ADD_MODULE_TO_MAP,
  data: ModuleShortInfo,
}

export interface RemoveModuleFromMap {
  type: constants.REMOVE_MODULE_FROM_MAP,
  data: string,
}

export interface SetAssigneeInModulesMap {
  type: constants.SET_ASSIGNE_IN_MODULES_MAP,
  data: {moduleId: string, assignee: number | null},
}

export interface SetAssignedToMe {
  type: constants.SET_ASSIGNED_TO_ME,
  data: ModuleShortInfo[],
}

export interface FetchModulesAssignedToMe {
  (dispatch: any): void
}

export type ModulesAction = SetModulesMap | AddModuleToMap | RemoveModuleFromMap | SetAssignedToMe | SetAssigneeInModulesMap

const setModulesMap = (payload: ModulesMap): SetModulesMap => {
  return {
    type: constants.SET_MODULES_MAP,
    data: payload,
  }
}

export const fetchModulesMap = (): FetchModulesMap => {
  return (dispatch: React.Dispatch<ModulesAction>) => {
    axios.get('modules')
      .then(res => {
        dispatch(setModulesMap(new Map(res.data.map((book: ModuleShortInfo) => [book.id, book]))))
      })
      .catch(e => {
        console.log('fetchModulesMap():', e.message)
        throw new Error(e.message)
      })
  }
}

export const addModuleToMap = (payload: ModuleShortInfo): AddModuleToMap => {
  return {
    type: constants.ADD_MODULE_TO_MAP,
    data: payload,
  }
}

export const removeModuleFromMap = (id: string): RemoveModuleFromMap => {
  return {
    type: constants.REMOVE_MODULE_FROM_MAP,
    data: id,
  }
}

export const setAssigneeInModulesMap = (moduleId: string, assignee: number | null): SetAssigneeInModulesMap => {
  return {
    type: constants.SET_ASSIGNE_IN_MODULES_MAP,
    data: {
      moduleId,
      assignee,
    },
  }
}

const setAssignedToMe = (modules: ModuleShortInfo[]): SetAssignedToMe => {
  return {
    type: constants.SET_ASSIGNED_TO_ME,
    data: modules,
  }
}

export const fetchModulesAssignedToMe = (): FetchModulesAssignedToMe => {
  return (dispatch: React.Dispatch<ModulesAction>) => {
    axios.get('modules/assigned/to/me')
      .then(res => {
        dispatch(setAssignedToMe(res.data))
      })
      .catch(e => {
        console.error('fetchModulesAssignedToMe():', e.message)
        throw new Error(e.message)
      })
  }
}
