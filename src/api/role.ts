import axios from 'src/config/axios'

import Base from './base'

import { elevated } from './utils'

/**
 * Role data.
 */
export type RoleData = {
  id: number,
  name: string,
  permissions?: Permission[], // only user with role:edit can see this field
}

export type Permission = 'user:invite' | 'user:delete' | 'user:edit-permissions' | 'user:assign-role' | 'book:edit' | 'module:edit' | 'module:assign' | 'role:edit'

export default class Role extends Base<RoleData> {
  /**
   * Fetch specific role from the server.
   */
  static async load(id: number): Promise<Role> {
    const rsp = await axios.get(`roles/${id}`)
    return new Role(rsp.data)
  }

  /**
   * Fetch list of all roles.
   */
  static async all(): Promise<Role[]> {
    const roles = await axios.get('roles')
    return roles.data.map((r: RoleData) => new Role(r))
  }

  /**
   * Create a new role.
   * 
   * This function requires role:edit permission.
   * 
   * @param name
   * @param permissions - Permission[]
   */
  static async create(name: string, permissions: Permission[] = []): Promise<Role> {
    const rsp = await elevated(() => axios.post('roles', { name, permissions }))
    return new Role(rsp.data)
  }

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
  permissions?: Permission[]

  /**
   * Update a role.
   * 
   * This function requires role:edit permission.
   * 
   * @param data - object with data to update
   */
  async update(data: {name?: string, permissions?: Permission[]}): Promise<Role> {
    const rsp = await elevated(() => axios.put(`roles/${this.id}`, data))
    return new Role(rsp.data)
  }


  /**
   * Delete a role.
   * This function requires role:edit permission.
   */
  async delete(): Promise<void> {
    await elevated(() => axios.delete(`roles/${this.id}`))
  }
}
