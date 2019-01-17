import { AxiosResponse } from 'axios'
import { APIError as BaseError, CNXML, Storage as StorageBase } from 'cnx-designer'
import { Value } from 'slate'

import axios from 'src/config/axios'

/**
 * Exception thrown by methods of {@link Storage} on API errors.
 */
export class APIError extends BaseError {
  response: AxiosResponse

  constructor(response: AxiosResponse) {
    super(`${response.status} ${response.statusText}`)
    this.response = response

    // Required to make extends Error work with babel
    ;(this as any).constructor = APIError
    ;(this as any).__proto__ = APIError.prototype
  }

  /**
   * Status code for the failed request.
   */
  get status() {
    return this.response.status
  }

  /**
   * Status text for the failed request.
   */
  get statusText() {
    return this.response.statusText
  }
}


export default class Storage extends StorageBase {
  id: string
  url: string
  title: string
  files: File[]
  tag: string | null = null
  value: Value | null = null

  /**
   * Load a document by ID.
   *
   * Retrieves basic information about a document and prepares
   * a {@link Storage} for later work.
   *
   * @return {Storage}
   */
  static async load(id: string) {
    const self = new Storage()

    self.id = id
    self.url = '/api/v1/drafts/' + id
    self.value = null

    const [data, files] = await Promise.all([
      self._request('', 'json'),
      self._request('/files', 'json'),
    ])

    self.title = data.name
    self.files = files

    return self
  }

  /**
   * Read the document.
   *
   * @return {Value}
   */
  async read() {
    const index = await this._request('/files/index.cnxml')
    this.tag = index.headers.get('ETag')
    this.value = CNXML.deserialize(await index.text())
    return this.value
  }

  async _request(path: string, data?: string) {
    const req = await fetch(this.url + path, {
      credentials: 'same-origin',
    })

    if (!req.ok) {
      throw new APIError(req as unknown as AxiosResponse)
    }

    return data ? req[data]() : req
  }
}
