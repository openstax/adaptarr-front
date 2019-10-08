import axios from 'src/config/axios'
import { AxiosResponse } from 'axios'

import Base from './base'
import User from './user'
import { TeamID } from './team'

import { elevate, elevated } from './utils'

export type ResourceData = {
  id: string
  name: string
  parent: string | null
  kind: ResourceKind
  team: TeamID
}

export type ResourceKind = 'directory' | 'file'

export type NewResourceData = {
  name: string
  team: TeamID
  parent?: string
  file?: File
}

export default class Resource extends Base<ResourceData> {
  /**
   * Load a resource by ID.
   */
  static async load(id: string): Promise<Resource> {
    const rsp = await axios.get(`resources/${id}`)
    return new Resource(rsp.data)
  }

  /**
   * Fetch list of all resources.
   */
  static async all(): Promise<Resource[]> {
    const resources = await axios.get('resources')
    return resources.data.map((data: ResourceData) => new Resource(data))
  }

  /**
   * Create a new resource.
   *
   * This function requires elevated permissions: 'resources:manage' in targeted team.
   *
   * @param name   name of the resource.
   * @param team   id of the team in which to create the resource.
   * @param parent optional parent id.
   * @param file optional file, if omitted "folder" will be created.
   */
  static async create({ name, team, parent, file }: NewResourceData): Promise<Resource> {
    const data: FormData = new FormData()

    data.append('name', name)
    data.append('team', team.toString())
    if (parent) {
      data.append('parent', parent)
    }
    if (file) {
      data.append('file', file)
    }

    const res = await axios.post('resources', data)
    return new Resource(res.data)
  }

  /**
   * Resurce's ID.
   */
  id: string

  /**
   * Resource's name.
   */
  name: string

  /**
   * Resource's parent.
   */
  parent?: string

  /**
   * Resource's kind.
   */
  kind: ResourceKind

  /**
   * ID of team for which this resource belongs.
   */
  team: TeamID

  /**
   * Fetch this resource's content.
   *
   * This endpoint is avaible only for non-directories.
   */
  async content(): Promise<File> {
    const rsp = await axios.get(`resources/${this.id}/content`)
    return rsp.data
  }

  /**
   * Update name of this resource.
   *
   * This method requires elevated permissions: 'resources:manage'
   */
  changeName(name: string): Promise<AxiosResponse> {
    return elevated(() => axios.put(`resources/${this.id}`, { name }))
  }

  /**
   * Replace contents of this resource.
   *
   * This method requires elevated permissions: 'resources:manage'
   */
  async replaceContent(file: File): Promise<AxiosResponse> {
    const session = await User.session()
    if (!session.is_elevated) {
      await elevate()
    }

    return axios.put(`resources/${this.id}/content`, file, {
      headers: {
        'Content-Type': 'multipart',
      },
    })
  }

  /**
   * Delete this resource.
   *
   * This method requires elevated permissions: 'resources:manage'
   */
  delete() {
    console.warn('This endpoint does not exists yet.')
    // await elevated(() => axios.delete(`resources/${this.id}`))
  }
}
