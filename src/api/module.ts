import axios from 'src/config/axios'

import Base from './base'
import User from './user'
import Draft from './draft'

/**
 * Module data as returned by the API.
 */
export type Data = {
  assignee?: number,
  id: string,
  title: string,
}

export default class Module extends Base<Data> {
  /**
   * Fetch module by ID.
   */
  static async load(id: string): Promise<Module> {
    const rsp = await axios.get(`modules/${id}`)
    return new Module(rsp.data)
  }

  /**
   * Fetch list of all modules assigned to a particular user.
   */
  static async assignedTo(user: User | string | number): Promise<Module[]> {
    const userId = user instanceof User ? user.apiId : user
    const modules = await axios.get(`modules/assigned/to/${userId}`)
    return modules.data.map((data: Data) => new Module(data))
  }

  /**
   * Fetch all drafts owned by current user.
   */
  static async all(): Promise<Module[]> {
    const drafts = await axios.get('modules')
    return drafts.data.map((data: Data) => new Module(data))
  }

  /**
   * Create a new module.
   */
  static async create(title: string): Promise<Module> {
    const rsp = await axios.post('modules', { title })
    return new Module(rsp.data)
  }

  /**
   * Create a new module, initializing it with contents of a ZIPped module
   * export.
   */
  static async createFromZip(title: string, file: File): Promise<Module> {
    const data = new FormData()
    data.append('title', title)
    data.append('file', file)
    const rsp = await axios.post('modules', data)
    return new Module(rsp.data)
  }

  /**
   * ID of the {@link User} currently assigned to this module.`
   */
  assignee?: number

  /**
   * ID of this module.
   */
  id: string

  /**
   * Title of this module.
   */
  title: string

  /**
   * Fetch list of files in this draft. This list does not include index.cnxml.
   */
  async files(): Promise<string[]> {
    return (await axios.get(`modules/${this.id}/files`)).data
  }

  /**
   * Fetch contents of a file.
   */
  async read(name: string): Promise<string> {
    return (await axios.get(`modules/${this.id}/files/${name}`)).data
  }

  /**
   * Assign a user to this module.
   */
  async assign(user: User | null): Promise<void> {
    const userId = user instanceof User ? user.id : user
    await axios.put(`modules/${this.id}`, { assignee: userId })
  }

  /**
   * Get an existing draft for this module, or {@code null}.
   */
  async draft(): Promise<Draft | null> {
    try {
      return await Draft.load(this)
    } catch (ex) {
      return null
    }
  }

  /**
   * Create a new draft of this module.
   */
  async createDraft(): Promise<Draft> {
    let data = await axios.post(`modules/${this.id}`)
    return new Draft(data.data)
  }

  /**
   * Delete this module.
   */
  async delete(): Promise<void> {
    await axios.delete(`modules/${this.id}`)
  }
}
