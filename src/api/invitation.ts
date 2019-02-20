import axios from 'src/config/axios'

import { elevated } from './utils'

export default class Invitation {
  /**
   * Create a new invitation.
   *
   * This function requires elevated permissions.
   */
  static async create(email: string, flags: number[]): Promise<void> {
    await elevated(() => axios.post('users/invite', { email, flags }))
  }
}
