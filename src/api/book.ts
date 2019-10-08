import axios from 'src/config/axios'

import Base from './base'
import BookPart from './bookpart'
import User from './user'
import { TeamID } from './team'

import { elevate, elevated } from './utils'

export type BookData = {
  id: string,
  title: string,
  team: TeamID
}

export type Diff = {
  title?: string,
}

export type NewModule = {
  title?: string,
  module: string,
}

export type NewGroup = {
  title: string,
  parts?: (NewModule | NewGroup)[],
}

export type NewPart = (NewModule | NewGroup) & {
  parent: number,
  index: number,
}

/**
 * Result of creating a new part in a book.
 */
export type NewPartData = {
  /**
   * Unique (within a book) ID of the created part.
   */
  number: number,

  /**
   * List of parts just created within this group.
   *
   * Present only if the part to be created was a group.
   */
  parts?: NewPartData[],
}

export default class Book extends Base<BookData> {
  /**
   * Load a book by ID.
   */
  static async load(id: string): Promise<Book> {
    const rsp = await axios.get(`books/${id}`)
    return new Book(rsp.data)
  }

  /**
   * Fetch list of all books.
   */
  static async all(): Promise<Book[]> {
    const books = await axios.get('books')
    return books.data.map((data: BookData) => new Book(data))
  }

  /**
   * Create a new book.
   *
   * This function requires elevated permissions.
   *
   * @param title   title of the book
   * @param team   ID of team in which book should be created
   * @param content file containing initial contents of the book, in format
   * compatible with Connexion's ZIP export
   */
  static async create(title: string, team: number, content?: File): Promise<Book> {
    let data: FormData | { title: string, team: number }
    let config: { headers: { 'Content-Type': string } }
    if (content) {
      data = new FormData()
      data.append('title', title)
      data.append('team', team.toString())
      data.append('file', content)
      config = { headers: { 'Content-Type': 'multipart' } }
    } else {
      data = { title, team }
      config = { headers: { 'Content-Type': 'application/json' } }
    }

    const res = await axios.post('books', data, config)
    return new Book(res.data)
  }

  /**
   * Book's ID.
   */
  id: string

  /**
   * Book's title.
   */
  title: string

  /**
   * ID of team for which this book belongs.
   */
  team: TeamID

  /**
   * Fetch this book's structure.
   */
  async parts(): Promise<BookPart> {
    const rsp = await axios.get(`books/${this.id}/parts`)
    return new BookPart(rsp.data, this)
  }

  /**
   * Replace contents of this book with a ZIPped collection.
   *
   * This method requires elevated permissions.
   */
  async replaceContent(file: File): Promise<void> {
    const session = await User.session()
    if (!session.is_elevated) {
      await elevate()
    }

    await axios.put(`books/${this.id}`, file, {
      headers: {
        'Content-Type': 'application/zip',
      },
    })
  }

  /**
   * Update this book.
   *
   * This method requires elevated permissions.
   */
  async update(diff: Diff): Promise<void> {
    await elevated(() => axios.put(`books/${this.id}`, diff))
  }

  /**
   * Create a new book part.
   *
   * This method requires elevated permissions.
   */
  async createPart(data: NewPart): Promise<NewPartData> {
    const rsp = await elevated(() => axios.post(`books/${this.id}/parts`, data))
    return rsp.data
  }

  /**
   * Delete this book.
   *
   * This method requires elevated permissions.
   */
  async delete(): Promise<void> {
    await elevated(() => axios.delete(`books/${this.id}`))
  }
}
