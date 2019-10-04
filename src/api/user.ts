import axios from 'src/config/axios'
import { AxiosResponse } from 'axios'

import Base from './base'
import Role, { RoleData } from './role'
import Draft, { DraftData } from './draft'
import Team, { TeamID, TeamPermission } from './team'

import { elevated } from './utils'

/**
 * User data as returned by the API.
 */
export type UserData = {
  id: number
  name: string
  is_super: boolean
  language: string
  permissions?: SystemPermission[] // Returned for users with user:edit-permissions` permission.
  teams: {
    id: TeamID
    name: string
    permissions: TeamPermission[]
    role: RoleData | null
  }[]
}

export type UserTeam = {
  id: TeamID
  name: string
  // Permissions not related to role.
  permissions: TeamPermission[]
  // All permissions which user has in team.
  allPermissions: Set<TeamPermission>
  role: Role | null
}

/**
 * Session details
 */
export type SessionInfo = {
  expires: string
  is_elevated: boolean
  permission: SystemPermission[]
}

/**
 * System permissions which users can have besides permissions from his role in team.
 */
export type SystemPermission = 'team:manage' | 'user:edit' | 'user:edit-permissions' | 'user:delete'

export default class User extends Base<UserData> {
  /**
   * Fetch a user by their ID.
   */
  static async load(id: number | string): Promise<User> {
    const user = (await axios.get(`users/${id}`)).data as UserData
    return new User(user)
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
      return new User(user, 'me')
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
   * Current session details.
   */
  static async session(): Promise<SessionInfo> {
    return (await axios.get(`/users/me/session`)).data
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
   * Determine if user is super user.
   */
  is_super: boolean

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
   * User's system permissions.
   */
  permissions: Set<SystemPermission>

  /**
   * All user's permissions across all teams and system.
   */
  allPermissions: Set<SystemPermission | TeamPermission>

  /**
   * Teams for which this users is member of.
  */
  teams: UserTeam[]

  constructor(data: UserData, apiId?: string) {
    super(data)

    this.apiId = apiId || data.id.toString()

    this.teams = data.teams.map(t => {
      const role = t.role ? new Role(t.role, t.id) : null
      const rolePermissions = role ? role.permissions || [] : []
      const allPermissions = new Set([...t.permissions, ...rolePermissions])
      return {
        ...t,
        role,
        allPermissions,
      }
    })

    this.permissions = new Set(data.permissions)

    let allPermissions: Set<TeamPermission | SystemPermission> = new Set(data.permissions)
    for (const team of this.teams) {
      if (team.role && team.role.permissions) {
        for (const p of team.role.permissions) {
          allPermissions.add(p)
        }
      }
    }

    this.allPermissions = allPermissions
  }

  /**
   * Check if user has one or more permissions in specific team.
   *
   * @param permission
   * @param team
   */
  hasPermissionsInTeam(permissions: TeamPermission | TeamPermission[], team: Team | TeamID): boolean {
    const teamId = typeof team === 'number' ? team : team.id
    const targetTeam = this.teams.find(t => t.id === teamId)
    if (!targetTeam) return false
    if (typeof permissions === 'string') {
      return targetTeam.allPermissions.has(permissions)
    }
    return permissions.every(p => targetTeam.allPermissions.has(p))
  }

  /**
   * Change name
   *
   * Require 'users:edit' permission to change other users name.
   * No permissions required to change own name.
   */
  async changeName(name: string): Promise<AxiosResponse> {
    return await elevated(() => axios.put(`users/${this.apiId}`, { name }))
  }

  /**
   * Change system permissions.
   */
  async changePermissions(permissions: SystemPermission[]): Promise<AxiosResponse> {
    return await elevated(() => axios.put(`users/${this.apiId}`, { permissions }))
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
