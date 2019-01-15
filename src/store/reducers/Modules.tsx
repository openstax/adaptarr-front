import { Module } from 'src/api'

import { ModulesMap } from 'src/store/types'
import { ModulesAction } from 'src/store/actions/Modules'
import {
  SET_MODULES_MAP,
  ADD_MODULE_TO_MAP,
  REMOVE_MODULE_FROM_MAP,
  SET_ASSIGNED_TO_ME,
  SET_ASSIGNE_IN_MODULES_MAP,
} from 'src/store/constants'

export interface State {
  modulesMap: ModulesMap
  assignedToMe: Module[]
}

// Define our initialState
export const initialState: State = {
  modulesMap: new Map(),
  assignedToMe: [],
}

export function reducer (state: State = initialState, action: ModulesAction) {
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
    case SET_ASSIGNE_IN_MODULES_MAP:
      const { moduleId, assignee } = action.data
      let modMapAfter = new Map(state.modulesMap)
      modMapAfter.set(moduleId, new Module({
        ...modMapAfter.get(moduleId)!,
        assignee: assignee || undefined,
      }))
      return {
        ...state,
        modulesMap: modMapAfter,
      }
    case SET_ASSIGNED_TO_ME:
      return {
        ...state,
        assignedToMe: action.data,
      }
  }
  return state
}
