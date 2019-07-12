import axios from 'src/config/axios'

import Base from './base'
import { elevated } from './utils'
import Role, { Permission } from './role'
import Draft, { DraftData } from './draft'

/**
 * User data as returned by the API.
 */
export type UserData = {
  id: number,
  name: string,
  role: Role | null,
  permissions?: Permission[], // Converted to Set<Permission> and merged with user.role.permissions
  language: string,
}

export default class User extends Base<UserData> {
  /**
   * Fetch a user by their ID.
   */
  static async load(id: number | string): Promise<User> {
    const user = (await axios.get(`users/${id}`)).data
    const userPermissions = user.permissions ? user.permissions : []
    const rolePermissions = user.role && user.role.permissions ? user.role.permissions : []
    const permissions = new Set([...userPermissions, ...rolePermissions])
    return new User({...user, permissions})
  }

  /**
   * Fetch information about the current user.
   *
   * @return Instance of {@link User} corresponding to the current user,
   * or null if there is no active session.
   */
  static async me(): Promise<User | null> {
    try {
      const user = (await axios.get('users/me')).data
      const userPermissions = user.permissions ? user.permissions : []
      const rolePermissions = user.role && user.role.permissions ? user.role.permissions : []
      const permissions = new Set([...userPermissions, ...rolePermissions])
      return new User({...user, permissions}, 'me')
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
   * User's language.
   */
  language: string

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
  permissions: Set<Permission>

  constructor(data: UserData, apiId?: string) {
    super(data)

    this.apiId = apiId || data.id.toString()
  }

  /**
   * Change role
   */
  async changeRole(id: number | null): Promise<any> {
    return await elevated(() => axios.put(`users/${this.apiId}`, { role: id }))
  }

  /**
   * Change permissions
   */
  async changePermissions(permissions: Permission[]): Promise<any> {
    return await elevated(() => axios.put(`users/${this.apiId}/permissions`, permissions))
  }

  /**
   * Change language.
   *
   * @param language ISO code of language
   */
  async changeLanguage(language: string) {
    if (this.apiId === 'me') {
      return await axios.put('users/me', { language })
    } else {
      return await elevated(() => axios.put(`users/${this.apiId}`, { language }))
    }
  }

  /**
   * User's drafts.
   */
  async drafts(): Promise<Draft[]> {
    const drafts = await axios.get(`/users/${this.apiId}/drafts`)
    return drafts.data.map((data: DraftData) => new Draft(data))
  }
}
