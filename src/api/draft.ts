import axios from 'src/config/axios'

import Base from './base'
import Module from './module'
import { SlotPermission, Link } from './process'

/**
 * Draft data as returned by the API.
 *
 * @type {Object}
 */
export type DraftData = {
  module: string,
  title: string,
  language: string,
  permissions?: SlotPermission[],
  step?: DraftStep,
}

/**
 * Result data for POST /api/v1/drafts/:id/advance
 */
export type AdvanceResult = {
  code: AdvanceCode,
  draft?: Draft, // if code is draft:process:advanced
  module?: Module, // if code is draft:process:finished
}

/**
 * draft:process:advanced if draft was advanced to the next step.
 * draft:process:finished if action has ended the process.
 */
export type AdvanceCode = 'draft:process:advanced' | 'draft:process:finished'

/**
 * Data from ProcessStep but without slots and with links only for current user.
 */
export type DraftStep = {
  name: string,
  links: Link[],
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
   * List of slot permissions current user has at this step.
   */
  permissions?: SlotPermission[]

  /**
   * Information about the step this draft is currently in.
   */
  step?: DraftStep

  /**
   * Advance this draft to the next step.
   * 
   * @param target and @param slot together must name one of the links returned in
   * GET /api/v1/drafts/:id.
   */
  async advance(data: { target: number, slot: number }): Promise<AdvanceResult> {
    return (await axios.post(`drafts/${this.module}/advance`, data)).data
  }

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
   * Update title of this draft. 
   */
  async updateTitle(title: string) {
    await axios.put(`drafts/${this.module}`, { title })
  }
}
