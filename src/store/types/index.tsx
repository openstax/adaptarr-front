export interface User {
  isLoading: boolean
  id: number | null
  name: string | null
  avatar: string | null
  avatarSmall: string | null
  role: string | null
  error?: string 
}

export interface Dashboard {
  isLoading: boolean,
  books: {id: string, title: string}[]
  assigned: {id: string, title: string, book: string}[]
  drafts: string[],
  error?: string,
}
