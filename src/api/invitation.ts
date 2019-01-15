import axios from 'src/config/axios'

export default class Invitation {
  /**
   * Create a new invitation.
   */
  static async create(email: string): Promise<void> {
    await axios.post('users/invite', { email })
  }
}
