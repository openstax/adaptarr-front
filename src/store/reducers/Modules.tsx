import { ModulesMap } from '../types'
import { ModulesAction } from '../actions/Modules'
import {
  SET_MODULES_MAP,
  ADD_MODULE_TO_MAP,
  REMOVE_MODULE_FROM_MAP,
} from '../constants'

export interface State {
  modulesMap: ModulesMap
}

// Define our initialState
export const initialState: State = {
  modulesMap: new Map()
}

export function reducer (state: State = initialState, action: ModulesAction) {
  console.log('action type', action.type)
  switch (action.type) {
    case SET_MODULES_MAP:
      return {
        ...state,
        modulesMap: action.data,
      }
    case ADD_MODULE_TO_MAP:
      let modulesMapAfterAdd = state.modulesMap
      modulesMapAfterAdd.set(action.data.id, action.data)
      return {
        ...state,
        modulesMap: modulesMapAfterAdd,
      }
    case REMOVE_MODULE_FROM_MAP:
      let modulesMapAfterDel = state.modulesMap
      modulesMapAfterDel.delete(action.data)
      return {
        ...state,
        modulesMap: modulesMapAfterDel,
      }
  }
  return state
}
