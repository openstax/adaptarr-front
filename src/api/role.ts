import axios from 'src/config/axios'

import Base from './base'
import { TeamID, TeamPermission } from './team'

import { elevated } from './utils'

/**
 * Role data.
 */
export type RoleData = {
  id: number
  name: string
  permissions?: TeamPermission[] // only user with role:edit can see this field
}

export default class Role extends Base<RoleData> {
  /**
   * Fetch specific role from the server.
   */
  static async load(id: number, team: TeamID): Promise<Role> {
    const rsp = await axios.get(`teams/${team}/roles/${id}`)
    return new Role(rsp.data, team)
  }

  /**
   * Fetch list of all roles.
   */
  static async all(team: TeamID): Promise<Role[]> {
    const roles = await axios.get(`/teams/${team}/roles`)
    return roles.data.map((r: RoleData) => new Role(r, team))
  }

  /**
   * Create a new role.
   *
   * This function requires role:edit permission.
   *
   * @param team
   * @param name
   * @param permissions - Permission[]
   */
  static async create(
    team: TeamID,
    name: string,
    permissions: TeamPermission[] = []
  ): Promise<Role> {
    const rsp = await elevated(() => axios.post(`teams/${team}/roles`, { name, permissions }))
    return new Role(rsp.data, team)
  }

  /**
   * ID of team in which this roles was created.
   */
  team: TeamID

  /**
   * Roles's ID.
   */
  id: number

  /**
   * Roles's name.
   */
  name: string

  /**
   * Roles's permissions.
   */
  permissions?: TeamPermission[]

  constructor(data: RoleData, team: TeamID) {
    super(data)

    this.team = team
  }

  /**
   * Update a role.
   *
   * This function requires role:edit permission.
   *
   * @param data - object with data to update
   */
  async update(data: {name?: string, permissions?: TeamPermission[]}): Promise<Role> {
    const rsp = await elevated(() => axios.put(`teams/${this.team}/roles/${this.id}`, data))
    return new Role(rsp.data, this.team)
  }


  /**
   * Delete a role.
   * This function requires role:edit permission.
   */
  async delete(): Promise<void> {
    await elevated(() => axios.delete(`teams/${this.team}/roles/${this.id}`))
  }
}
