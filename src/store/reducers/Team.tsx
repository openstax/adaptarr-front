import { TeamAction } from '../actions/Team'
import { TeamMap } from '../types'
import { 
  SET_TEAM_MAP,
} from '../constants'

export interface State {
  teamMap: TeamMap
}

export const initialState = {
  teamMap: new Map(),
}

export function reducer (state: State = initialState, action: TeamAction) {
  switch (action.type) {
    case SET_TEAM_MAP:
      return {
        ...state,
        teamMap: action.data,
      }
  }

  return state
}
