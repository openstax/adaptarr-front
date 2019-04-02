import axios from 'src/config/axios'

import Base from './base'

import { elevated } from './utils'
import Role, { Permission } from './role'

/**
 * User data as returned by the API.
 */
export type UserData = {
  id: number,
  name: string,
  role: Role | null,
}

/**
 * User permissions.
 */
export type UserPermissions = {
  permissions?: Permission[],
}

export default class User extends Base<UserData & UserPermissions> {
  /**
   * Fetch a user by their ID.
   */
  static async load(id: number | string): Promise<User> {
    const rsp = await axios.get(`users/${id}`)
    return new User(rsp.data)
  }

  /**
   * Fetch information about the current user.
   *
   * @return Instance of {@link User} corresponding to the current user,
   * or null if there is no active session.
   */
  static async me(): Promise<User | null> {
    try {
      const user = await axios.get('users/me')
      const permissions = await axios.get('users/me/permissions')
      let data = {
        ...user.data,
        permissions: permissions.data || [],
      }
      return new User(data, 'me')
    } catch (err) {
      console.log('error', err)
      if (err.response.status === 401) {
        return null
      }
      throw err
    }
  }

  /**
   * Fetch list of all users.
   */
  static async all(): Promise<User[]> {
    const users = await axios.get('users')

    return users.data.map((user: UserData) => new User(user))
  }

  /**
   * Change password
   */
  static async changePassword(current: string, newPass: string, newPass2: string) {
    const payload = {
      current,
      new: newPass,
      new2: newPass2,
    }
    
    return await axios.put('users/me/password', payload)
  }

  /**
   * User's identificator.
   */
  id: number

  /**
   * User's name.
   */
  name: string

  /**
   * Identificator to use when making requests.
   *
   * This is usually the same as {@link User#id}, except for current user,
   * in which case it is {@code me}.
   *
   * @private
   */
  apiId: string

  /**
   * User's role.
   */
  role: Role | null

  /**
   * User's permissions.
   */
  permissions: Permission[]

  constructor(data: UserData, apiId?: string) {
    super(data)

    this.apiId = apiId || data.id.toString()
  }

  /**
   * Change role
   */
  async changeRole(id: number): Promise<any> {
    return await elevated(() => axios.put(`users/${this.apiId}`, { role: id }))
  }

  /**
   * Change permissions
   */
  async changePermissions(permissions: Permission[]): Promise<any> {
    return await elevated(() => axios.put(`users/${this.apiId}/permissions`, permissions))
  }
}
