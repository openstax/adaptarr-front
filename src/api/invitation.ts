import axios from 'src/config/axios'

import { TeamID, TeamPermission } from './team'

import { elevated } from './utils'

export type InvitationData = {
  email: string
  language: string
  role?: number
  team?: TeamID // Requires permission member:add in targeted team.
  permissions: TeamPermission[]
}

export default class Invitation {
  /**
   * Create a new invitation.
   *
   * This function requires elevated permissions.
   */
  static async create({ email, role, language, team, permissions }: InvitationData): Promise<void> {
    await elevated(() => axios.post('users/invite', { email, role, language, team, permissions }))
  }
}
