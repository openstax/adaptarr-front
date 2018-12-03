export interface User {
  id?: number
  name?: string
}

export interface Dashboard {
  isLoading: boolean,
  books: {id: string, title: string}[]
  assigned: {id: string, title: string, book: string}[]
  drafts: string[]
}
