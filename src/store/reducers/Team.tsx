import User from 'src/api/user'
import { TeamAction } from 'src/store/actions/Team'
import { TeamMap } from 'src/store/types'
import {
  SET_TEAM_MAP,
  SET_USER_IN_TEAM_MAP,
} from 'src/store/constants'

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
    case SET_USER_IN_TEAM_MAP:
      let teamMapAfter = state.teamMap
      teamMapAfter.set(action.data.id, new User({...action.data}))
      return {
        ...state,
        teamMap: teamMapAfter,
      }
  }

  return state
}
