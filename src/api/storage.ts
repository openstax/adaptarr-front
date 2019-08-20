import tablesDeserialize from 'src/screens/app/Draft/plugins/Tables/deserialize'
import tablesSerialize from 'src/screens/app/Draft/plugins/Tables/serialize'
import sourceElementsDeserialize from 'src/screens/app/Draft/plugins/SourceElements/deserialize'
import sourceElementsSerialize from 'src/screens/app/Draft/plugins/SourceElements/serialize'
import suggestionRules from 'src/screens/app/Draft/plugins/Suggestions/deSerializationRules'
import { APIError as BaseError, CNXML, Storage as StorageBase } from 'cnx-designer'
import { Value } from 'slate'
import { AxiosResponse } from 'axios'

import axios from 'src/config/axios'
import { DraftData } from './draft'

/**
 * Exception thrown by methods of {@link Storage} on API errors.
 */
export class APIError extends BaseError {
  _response: AxiosResponse

  constructor(response: AxiosResponse) {
    super(`${response.status} ${response.statusText}`)
    this._response = response
  }

  /**
   * Whole response for the failed request.
   */
  get response() {
    return this._response
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
  language: string = 'en'
  files: FileDescription[]
  tag: string
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

    const [data, files]: [AxiosResponse<DraftData>, AxiosResponse<FileDescription[]>] = await Promise.all([
      axios.get(`drafts/${id}`),
      axios.get(`drafts/${id}/files`),
    ])

    self.title = data.data.title
    self.files = files.data

    return self
  }

  /**
   * Read the document.
   */
  async read(): Promise<Index> {
    const index = await axios.get(`drafts/${this.id}/files/index.cnxml`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
    this.tag = index.headers.etag
    return new Index(this.tag, await index.data)
  }

  /**
   * Write the document
   */
  async write(document: Value, glossary: Value | null, overwrite: boolean = false) {
    try {
      const text = Storage.serializer.serialize(document, glossary, {
        title: this.title,
        language: this.language,
      })

      const rsp = await axios.put(`drafts/${this.id}/files/index.cnxml`, text, overwrite ? undefined : {
        headers: {
          'If-Match': this.tag,
        },
      })

      this.document = document
      this.glossary = glossary
      this.tag = rsp.headers.etag
    } catch (e) {
      throw new APIError(e.response)
    }
  }

  /**
   * Write a file.
   */
  async writeFile(file: File) {
    try {
      await axios.put(`drafts/${this.id}/files/${file.name}`, file)
      this.files.push({ name: file.name, mime: file.type })
    } catch (e) {
      throw new APIError(e.response)
    }
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

  /**
   * Set language for this document to given value.
   * It will be used to save cnxml with correct value.
   *
   * @param {string} code ISO language code
   */
  setLanguage(code: string) {
    this.language = code
  }

  static serializer = new CNXML({
    documentRules: [tablesDeserialize, tablesSerialize, sourceElementsDeserialize, sourceElementsSerialize, suggestionRules],
    glossaryRules: [suggestionRules],
  })
}

export class Index {
  version: string
  content: string

  constructor(version: string, content: string) {
    this.version = version
    this.content = content
  }

  deserialize() {
    return Storage.serializer.deserialize(this.content)
  }
}
