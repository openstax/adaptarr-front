import axios from 'src/config/axios'

import Base from './base'
import Role, { RoleData } from './role'
import TeamMember, { NewTeamMemberData } from './teammember'

import { elevated } from './utils'

export type TeamID = number

export type TeamPermission =
'member:add' | 'member:remove' |
'member:assign-role' | 'member:edit-permissions' |
'role:edit' | 'book:edit' | 'module:edit' |
'editing-process:edit' | 'editing-process:manage' |
'resources:manage'

/**
 * Team data.
 */
export type TeamData = {
  id: number
  name: string
  roles: RoleData[]
}

export default class Team extends Base<TeamData> {
  /**
   * Fetch specific team from the server.
   */
  static async load(id: TeamID): Promise<Team> {
    const rsp = await axios.get(`teams/${id}`)
    return new Team(rsp.data)
  }

  /**
   * Fetch list of all teams which user can access.
   */
  static async all(): Promise<Team[]> {
    const teams = await axios.get('teams')
    return teams.data.map((r: TeamData) => new Team(r))
  }

  /**
   * Create a new team.
   *
   * This function requires team:manage permission.
   *
   * @param name
   */
  static async create(name: string): Promise<Team> {
    const rsp = await elevated(() => axios.post('teams', { name }))
    return new Team(rsp.data)
  }

  /**
   * Team's ID.
   */
  id: TeamID

  /**
   * Team's name.
   */
  name: string

  /**
   * Roles in this team.
   */
  roles: Role[]

  /**
   * Cached team members fetched by this.members()
   */
  private _teamMembers?: TeamMember[]

  constructor(data: TeamData) {
    super(data)

    this.roles = data.roles.map(rd => new Role(rd, data.id))
  }

  /**
   * Update a team.
   *
   * This function requires team:manage permission.
   *
   * @param data - object with data to update
   */
  async update(data: { name: string }): Promise<Team> {
    const rsp = await elevated(() => axios.put(`teams/${this.id}`, data))
    return new Team(rsp.data)
  }

  /**
   * Get roles in this team.
   */
  async getRoles(): Promise<Role[]> {
    const roles = await Role.all(this.id)
    this.roles = roles
    return roles
  }

  /**
   * Get data for specific role in team.
   */
  async getRole(id: number): Promise<Role> {
    return await Role.load(id, this.id)
  }

  /**
   * Create role in team.
   */
  async createRole({ name, permissions = [] }: { name: string, permissions?: TeamPermission[] }): Promise<Role> {
    return await Role.create(this.id, name, permissions)
  }

  /**
   * Get team members.
   *
   * @param {boolean} fromCache will determine if members should be fetched from the server
   * or just received from cache.
   */
  async members(fromCache = true): Promise<TeamMember[]> {
    if (fromCache && this._teamMembers) return this._teamMembers
    const members = await TeamMember.all(this.id)
    this._teamMembers = members
    return members
  }

  /**
   * Get data for specific member in team.
   */
  async member(id: number): Promise<TeamMember> {
    return await TeamMember.load(id, this.id)
  }

  /**
   * Add member to team.
   */
  async addMember(data: NewTeamMemberData): Promise<TeamMember> {
    return await TeamMember.add(this.id, data)
  }

  /**
   * Delete a team.
   * This function requires team:manage permission.
   */
  async delete(): Promise<void> {
    await elevated(() => axios.delete(`teams/${this.id}`))
  }
}
