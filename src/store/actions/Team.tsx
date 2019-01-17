import { User } from 'src/api'

import * as constants from 'src/store/constants'
import { TeamMap } from 'src/store/types'

export interface FetchTeamMap {
  (dispatch: any): void
}

export interface SetTeamMap {
  type: constants.SET_TEAM_MAP,
  data: TeamMap,
}

export type TeamAction = SetTeamMap

export const setTeamMap = (payload: TeamMap): SetTeamMap => {
  return {
    type: constants.SET_TEAM_MAP,
    data: payload,
  }
}

export const fetchTeamMap = (): FetchTeamMap => {
  return (dispatch: React.Dispatch<TeamAction>) => {
    User.all()
      .then(users => {
        dispatch(setTeamMap(new Map(users.map((user: User): [number, User] => [user.id, user]))))
      })
      .catch(e => {
        console.log('fetchTeamMap():', e.message)
        throw new Error(e.message)
      })
  }
}
