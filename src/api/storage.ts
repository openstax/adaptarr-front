import tablesDeserialize from 'src/screens/app/Draft/plugins/Tables/deserialize'
import tablesSerialize from 'src/screens/app/Draft/plugins/Tables/serialize'
import { APIError as BaseError, CNXML, Storage as StorageBase } from 'cnx-designer'
import { Value } from 'slate'

/**
 * Exception thrown by methods of {@link Storage} on API errors.
 */
export class APIError extends BaseError {
  response: Response

  constructor(response: Response) {
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

/**
 * A file, as understood by {@link Storage}.
 */
export type FileDescription = {
  name: string,
  mime: string,
}

export default class Storage extends StorageBase {
  id: string
  url: string
  title: string
  files: FileDescription[]
  tag: string | null = null
  document: Value | null = null
  glossary: Value | null = null

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
    self.document = null

    const [data, files] = await Promise.all([
      self._request('', 'json'),
      self._request('/files', 'json'),
    ])

    self.title = data.title
    self.files = files

    return self
  }

  /**
   * Read the document.
   *
   * @return {document: Value, glossary: Value}
   */
  async read() {
    const index = await this._request('/files/index.cnxml')
    this.tag = index.headers.get('ETag')
    const deserialize = this.serializer.deserialize(await index.text())
    this.document = deserialize.document
    this.glossary = deserialize.glossary
    return { document: this.document, glossary: this.glossary }
  }

  /**
   * Write the document
   */
  async write(document: Value, glossary: Value | null) {
    const text = this.serializer.serialize(document, glossary, this.title)

    const req = await fetch(this.url + '/files/index.cnxml', {
      method: 'PUT',
      credentials: 'same-origin',
      body: text,
    })

    if (!req.ok) {
      throw new APIError(req)
    }

    this.document = document
    this.glossary = glossary
  }

  /**
   * Write a file.
   */
  async writeFile(file: File) {
    const req = await fetch(this.url + '/files/' + file.name, {
      method: 'PUT',
      credentials: 'same-origin',
      body: file,
    })

    if (!req.ok) {
      throw new APIError(req)
    }

    this.files.push({ name: file.name, mime: file.type })
  }

  /**
   * Check if a {@link Value} is current.
   */
  current(document: Value, glossary: Value) {
    return this.document !== null && this.document.document.equals(document.document) && this.glossary !== null && this.glossary.document.equals(glossary.document)
  }

  /**
   * Return an URL for a given media file.
   */
  mediaUrl(name: string) {
    return this.url + '/files/' + name
  }

  async _request(path: string, data?: string) {
    const req = await fetch(this.url + path, {
      credentials: 'same-origin',
    })

    if (!req.ok) {
      throw new APIError(req)
    }

    return data ? req[data]() : req
  }

  serializer = new CNXML({
    documentRules: [tablesDeserialize, tablesSerialize],
    glossaryRules: [],
  })
}
