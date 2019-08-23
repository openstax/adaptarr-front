import axios from 'src/config/axios'
import { AxiosResponse } from 'axios'

import Base from './base'
import Module from './module'
import { SlotPermission, ProcessSingleStep } from './process'
import { UserData } from './user'
import { elevated } from './utils'

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
  step?: ProcessSingleStep,
  books: string[],
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
 * Details about the process this draft follows.
 */
export type ProcessDetails = {
  id: number,
  name: string,
  version: string,
  slots: SlotDetails[],
}

export type SlotDetails = {
  id: number,
  name: string,
  roles: number[],
  user: UserData | null,
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
   * Fetch all drafts which are in process in which user have a slot.
   */
  static async all(): Promise<Draft[]> {
    const drafts = await axios.get('drafts')
    return drafts.data.map((data: DraftData) => new Draft(data))
  }

  /**
   * Assign user to a slot.
   *
   * This function requires editing-process:manage permission.
   */
  static async assignUser(draftId: string, slot: number, userId: number): Promise<AxiosResponse> {
    return await elevated(() => axios.put(`drafts/${draftId}/process/slots/${slot}`, userId, {
      headers: {
        'Content-Type': 'application/json',
      }
    }))
  }

  /**
   * Get details about the process this draft follows.
   *
   * This function requires editing-process:manage permission.
   */
  static async details(draftId: string): Promise<ProcessDetails> {
    return (await elevated(() => axios.get(`drafts/${draftId}/process`))).data
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
  step?: ProcessSingleStep

  /**
   * All books ids in which this draft occurs.
   */
  books: string[]

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

  /**
   * Cancel process for this draft.
   *
   * All changes will be lost.
   */
  async cancelProcess(): Promise<AxiosResponse> {
    return await elevated(() => axios.delete(`drafts/${this.module}`))
  }

  /**
   * Write index.cnxml.
   */
  async writeCNXML(text: string) {
    return await axios.put(`drafts/${this.module}/files/index.cnxml`, text)
  }
}
