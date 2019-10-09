import { sortRefTargets } from 'src/helpers'

import { ModulesMap, ReferenceTargets } from 'src/store/types'
import { ModulesAction } from 'src/store/actions/modules'
import {
  ADD_MODULE_TO_MAP,
  REMOVE_MODULE_FROM_MAP,
  SET_MODULES_MAP,
  SET_REFERENCE_TARGETS,
} from 'src/store/constants'

export interface State {
  modulesMap: ModulesMap
  referenceTargets: ReferenceTargets
}

// Define our initialState
export const initialState: State = {
  modulesMap: new Map(),
  referenceTargets: new Map(),
}

// eslint-disable-next-line default-param-last
export function reducer(state: State = initialState, action: ModulesAction): State {
  switch (action.type) {
  case SET_MODULES_MAP:
    return {
      ...state,
      modulesMap: action.data,
    }

  case ADD_MODULE_TO_MAP: {
    const modulesMapAfterAdd = state.modulesMap
    modulesMapAfterAdd.set(action.data.id, action.data)
    return {
      ...state,
      modulesMap: modulesMapAfterAdd,
    }
  }

  case REMOVE_MODULE_FROM_MAP: {
    const modulesMapAfterDel = state.modulesMap
    modulesMapAfterDel.delete(action.data)
    return {
      ...state,
      modulesMap: modulesMapAfterDel,
    }
  }

  case SET_REFERENCE_TARGETS: {
    const targets = new Map(state.referenceTargets)
    targets.set(action.data.moduleId, action.data.targets.sort(sortRefTargets))
    return {
      ...state,
      referenceTargets: targets,
    }
  }

  default:
    return state
  }
}