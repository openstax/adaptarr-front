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

export type ModulesAction = SetModulesMap | AddModuleToMap | RemoveModuleFromMap

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
