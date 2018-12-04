import axios from '../../config/axios'

import * as constants from '../constants'
import { ModulesMap, ModuleShortInfo } from '../types'

export interface FetchModulesMap {
  (dispatch: any): void
}

export interface SetModulesMap {
  type: constants.SET_MODULES_MAP,
  data: ModulesMap,
}

export type ModulesAction = SetModulesMap

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
