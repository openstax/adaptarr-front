import User, { UserData } from 'src/api/user'

import * as constants from 'src/store/constants'
import { TeamMap } from 'src/store/types'

export interface FetchTeamMap {
  (dispatch: any): void
}

export interface SetTeamMap {
  type: constants.SET_TEAM_MAP,
  data: TeamMap,
}

export interface SetUserInTeamMap {
  type: constants.SET_USER_IN_TEAM_MAP,
  data: UserData,
}

export interface UpdateUserInTeamMap {
  (dispatch: any): void
}

export type TeamAction = SetTeamMap | SetUserInTeamMap

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

export const setUserInTeamMap = (payload: UserData): SetUserInTeamMap => {
  return {
    type: constants.SET_USER_IN_TEAM_MAP,
    data: payload,
  }
}

export const updateUserInTeamMap = (userData: UserData): UpdateUserInTeamMap => {
  return (dispatch: React.Dispatch<TeamAction>) => {
    dispatch(setUserInTeamMap(userData))
  }
}
