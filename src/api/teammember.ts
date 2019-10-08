import axios from 'src/config/axios'

import Base from './base'
import Role from './role'
import { TeamID, TeamPermission } from './team'

import { elevated } from './utils'

/**
 * TeamMember data.
 */
export type TeamMemberData = {
  user: number
  permissions: TeamPermission[]
  role: Role | null
}

export type NewTeamMemberData = {
  user: number
  permissions: TeamPermission[]
  role?: number
}

export type TeamMemberUpdateData = {
  permissions?: TeamPermission[]
  role?: number | null
}

export default class TeamMember extends Base<TeamMemberData> {
  /**
   * Fetch specific team member from the server.
   */
  static async load(team: TeamID, id: number): Promise<TeamMember> {
    const rsp = await axios.get(`teams/${team}/members/${id}`)
    return new TeamMember(rsp.data, team)
  }

  /**
   * Fetch list of all team members which user can access.
   */
  static async all(team: TeamID): Promise<TeamMember[]> {
    const rsp = await axios.get(`teams/${team}/members`)
    return rsp.data.map((tm: TeamMemberData) => new TeamMember(tm, team))
  }

  /**
   * Add member to the team.
   *
   * This function requires member:add permission.
   */
  static async add(team: TeamID, data: NewTeamMemberData): Promise<TeamMember> {
    const rsp = await elevated(() => axios.post(`teams/${team}/members`, data))
    return new TeamMember(rsp.data, team)
  }

  /**
   * ID of Team this is member of.
   */
  team: TeamID

  /**
   * User ID.
   */
  user: number

  /**
   * Permissions this member has.
   */
  permissions: TeamPermission[]

  /**
   * Role this member has.
   */
  role: Role | null

  constructor(data: TeamMemberData, team: TeamID) {
    super(data)

    this.team = team
  }

  /**
   * Update a team member.
   *
   * This function requires member:edit-permissions or / and member:assign-role permissions.
   *
   * @param data - object with data to update
   */
  async update(data: TeamMemberUpdateData): Promise<TeamMember> {
    const rsp = await elevated(() => axios.put(`teams/${this.team}/members/${this.user}`, data))
    return new TeamMember(rsp.data, this.team)
  }

  /**
   * Delete a member from team.
   * This function requires member:remove permission.
   */
  async delete(): Promise<void> {
    await elevated(() => axios.delete(`teams/${this.team}/members/${this.user}`))
  }
}
