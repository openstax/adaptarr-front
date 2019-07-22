import axios from 'src/config/axios'
import { AxiosResponse } from 'axios'

import Base from './base'
import User from './user'
import { elevated, elevate } from './utils'

export type ResourceData = {
  id: string,
  name: string,
  parent: string | null,
  kind: ResourceKind,
}

export type ResourceKind = 'directory' | 'file'

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
   * This function requires elevated permissions: 'resources:manage'
   *
   * @param name   name of the resource.
   * @param parent optional parent id.
   * @param file optional file, if omitted "folder" will be created.
   */
  static async create({ name, parent, file }: { name: string, parent?: string, file?: File}): Promise<Resource> {
    let data: FormData = new FormData()

    data.append('name', name)
    if (parent) {
      data.append('parent', parent)
    }
    if (file) {
      data.append('file', file)
    }

    const session = await User.session()
    if (!session.is_elevated) {
      await elevate()
    }

    let res = await axios.post('resources', data)
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
  async changeName(name: string): Promise<AxiosResponse> {
    return await elevated(() => axios.put(`resources/${this.id}`, { name }))
  }

  /**
   * Replace contents of this resource.
   *
   * This method requires elevated permissions: 'resources:manage'
   */
  async replaceContent(file: File): Promise<AxiosResponse> {
    return await elevated(() => axios.put(`resources/${this.id}/content`, file, {
      headers: {
        'Content-Type': 'multipart',
      },
    }))
  }

  /**
   * Delete this resource.
   *
   * This method requires elevated permissions: 'resources:manage'
   */
  async delete(): Promise<void> {
    console.warn('This endpoint does not exists yet.')
    return
    await elevated(() => axios.delete(`resources/${this.id}`))
  }
}
