import axios from 'src/config/axios'

import Base from './base'

/**
 * User data as returned by the API.
 */
export type UserData = {
  id: number,
  name: string,
  language: string,
}

export default class User extends Base<UserData> {
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
      return new User(user.data, 'me')
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
   * Change language.
   * 
   * @param language ISO code of language
   */
  static async changeLanguage(language: string) {
    return await axios.put('users/me', { language })
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

  constructor(data: UserData, apiId?: string) {
    super(data)

    this.apiId = apiId || data.id.toString()
  }
}
