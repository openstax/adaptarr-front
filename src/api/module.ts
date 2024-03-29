import { AxiosResponse } from 'axios'
import axios from 'src/config/axios'

import Base from './base'
import Draft from './draft'
import { TeamID } from './team'

import { elevated } from './utils'

/**
 * Module data as returned by the API.
 */
export type Data = {
  id: string
  title: string
  language: string
  process: ModuleProcess | null
  team: TeamID
}

/**
 * Short info about current process for module.
 */
export type ModuleProcess = {
  process: number,
  step: {
    id: number,
    name: string,
  },
  version: number,
}

export type RefTargetType
  = 'commentary'
  | 'example'
  | 'exercise'
  | 'figure'
  | 'note'
  | 'solution'
  | 'subfigure'

export type RefTarget = {
  /**
   * This target element's ID.
   */
  id: string,
  /**
   * This element's type.
   */
  type: RefTargetType,
  /**
   * A short description of this element intended to make it easier for users
   * to select the correct element when creating a cross-document reference.
   */
  description: string | null,
  /**
   * ID of a reference target “owning” this one.
   */
  context: string | null,
  /**
   * Value of the type-counter at this element.
   *
   * For elements that have `context` type counter resets at context.
   */
  counter: number,
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
   * Fetch all drafts owned by current user.
   */
  static async all(): Promise<Module[]> {
    const drafts = await axios.get('modules')
    return drafts.data.map((data: Data) => new Module(data))
  }

  /**
   * Fetch all books ids in which this module occurs.
   */
  async books(): Promise<string[]> {
    const books = await axios.get(`modules/${this.id}/books`)
    return books.data
  }

  /**
   * Create a new module.
   * This function requires elevated permissions.
   *
   * @param title
   * @param language - ISO language tag
   * @param team - team ID in which module should be created.
   */
  static async create(title: string, language: string, team: TeamID): Promise<Module> {
    const rsp = await elevated(() => axios.post('modules', { title, language, team }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }))
    return new Module(rsp.data)
  }

  /**
   * Create a new module, initializing it with contents of a ZIPped module
   * export.
   *
   * This function requires elevated permissions.
   */
  static async createFromZip(title: string, file: File, team: TeamID): Promise<Module> {
    const data = new FormData()
    data.append('title', title)
    data.append('file', file)
    data.append('team', team.toString())
    const rsp = await elevated(() => axios.post('modules', data))
    return new Module(rsp.data)
  }

  /**
   * ID of this module.
   */
  id: string

  /**
   * Title of this module.
   */
  title: string

  /**
   * Language of this document.
   */
  language: string

  /**
   * Short info about current process for this module.
   */
  process: ModuleProcess | null

  /**
   * ID of team for which this modules belongs.
   */
  team: TeamID

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
    return (await axios.get(`modules/${this.id}/files/${name}`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })).data
  }

  /**
   * Fetch list of possible reference targets in this module.
   */
  async referenceTargets(): Promise<RefTarget[]> {
    return (await axios.get(`modules/${this.id}/xref-targets`)).data
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
   * Begin process for this module.
   *
   * This method requires editing-process:manage permission.
   *
   * @param process processId
   * @param slots array of pairs [slotId, userId]
   */
  beginProcess(data: { process: number, slots: [number, number][]}): Promise<AxiosResponse> {
    return elevated(() => axios.post(`modules/${this.id}`, data))
  }

  /**
   * Delete this module.
   *
   * This method requires elevated permissions.
   */
  async delete(): Promise<void> {
    await elevated(() => axios.delete(`modules/${this.id}`))
  }
}
