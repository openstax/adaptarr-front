import axios from 'src/config/axios'

import Base from './base'
import Module from './module'

/**
 * Draft data as returned by the API.
 *
 * @type {Object}
 */
export type DraftData = {
  module: string,
  title: string,
  language: string,
}

export default class Draft extends Base<DraftData> {
  /**
   * Fetch module by ID.
   */
  static async load(module: Module | string): Promise<Draft> {
    const id = module instanceof Module ? module.id : module
    const rsp = await axios.get(`drafts/${id}`)
    return new Draft(rsp.data)
  }

  /**
   * Fetch all drafts owned by current user.
   */
  static async all(): Promise<Draft[]> {
    const drafts = await axios.get('drafts')
    return drafts.data.map((data: DraftData) => new Draft(data))
  }

  /**
   * Fetch all books ids in which this draft occurs.
   */
  async books(): Promise<string[]> {
    const books = await axios.get(`drafts/${this.module}/books`)
    return books.data
  }

  /**
   * ID of the module of which this is a draft.
   */
  module: string

  /**
   * Title of the module as of this draft.
   */
  title: string

  /**
   * Language of the module as of this draft.
   */
  language: string

  /**
   * Fetch list of files in this draft. This list does not include index.cnxml.
   */
  async files(): Promise<string[]> {
    return (await axios.get(`drafts/${this.module}/files`)).data
  }

  /**
   * Fetch contents of a file.
   */
  async read(name: string): Promise<string> {
    return (await axios.get(`drafts/${this.module}/files/${name}`)).data
  }

  /**
   * Save this draft as a new version of the module.
   */
  async save() {
    await axios.post(`drafts/${this.module}/save`)
  }

  /**
   * Delete this draft.
   */
  async delete() {
    await axios.delete(`drafts/${this.module}`)
  }

  /**
   * Update title of this draft. 
   */
  async updateTitle(title: string) {
    await axios.put(`drafts/${this.module}`, { title })
  }
}
