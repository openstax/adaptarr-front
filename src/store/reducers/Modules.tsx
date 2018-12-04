import { ModulesMap } from '../types'
import { ModulesAction } from '../actions/Modules'
import {
  SET_MODULES_MAP,
} from '../constants'

export interface State {
  modulesMap: ModulesMap
}

// Define our initialState
export const initialState: State = {
  modulesMap: new Map()
}

export function reducer (state: State = initialState, action: ModulesAction) {
  switch (action.type) {
    case SET_MODULES_MAP:
      return {
        ...state,
        modulesMap: action.data,
      }
  }
  return state
}
