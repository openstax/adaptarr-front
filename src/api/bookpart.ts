import axios from 'src/config/axios'

import Base from './base'
import Book from './book'
import Module, { ModuleProcess } from './module'
import { elevated } from './utils'

export type Kind = 'module' | 'group'

export type ModuleData = {
  kind: 'module',
  number: number,
  title: string,
  id: string,
  process: ModuleProcess | null,
  language: string,
}

export type GroupData = {
  kind: 'group',
  number: number,
  title: string,
  parts: PartData[],
}

export type PartData = ModuleData | GroupData

export type LocationUpdate = {
  parent: number,
  index: number,
}

export type DataUpdate = {
  title?: string
}

export type Update = (LocationUpdate & DataUpdate) | DataUpdate

export default class BookPart extends Base<PartData> {
  /**
   * Designates whether this part is a module or a group of other parts.
   */
  kind: Kind

  /**
   * Unique identifier of this part within a book.
   */
  number: number

  /**
   * Title of this part.
   */
  title: string

  /**
   * ID of the module this part corresponds to (if {@link #kind} is
   * {@code 'module'}).
   */
  id?: string

  /**
   * Process data of module for this part (if {@link #kind} is
   * {@code 'module'}).
   */
  process?: ModuleProcess | null

  /**
   * Language of this modules for this part (if {@link #kind} is
   * {@code 'module'}).
   */
  language?: string

  /**
   * List of parts which make up this group (only if {@link #kind} is
   * {@code 'group'}).
   */
  parts?: BookPart[]

  /**
   * ID of the book this is a part of.
   */
  book: string

  constructor(data: PartData, book: Book | string) {
    super(data)

    this.book = book instanceof Book ? book.id : book

    if (data.kind === 'group') {
      this.parts = data.parts.map(data => new BookPart(data, book))
    }
  }

  /**
   * Fetch module this part references.
   */
  async module(): Promise<Module | null> {
    return this.id ? await Module.load(this.id) : null
  }

  /**
   * Update this part.
   *
   * This method requires elevated permissions.
   */
  async update(diff: Update): Promise<void> {
    await elevated(() => axios.put(`/books/${this.book}/parts/${this.number}`, diff))
  }

  /**
   * Remove this book part from its book.
   *
   * If this book part is a group this will remove all its child book parts. If
   * this book part is a module, the module it references will not be deleted.
   *
   * This method requires elevated permissions.
   */
  async delete(): Promise<void> {
    await elevated(() => axios.delete(`books/${this.book}/parts/${this.number}`))
  }
}
