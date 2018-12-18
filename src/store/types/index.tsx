export type IsLoading = boolean
export type RequestStatus = {status: string, message?: string | {}}



export interface User {
  id: number
  name: string
  avatar?: string
  avatarSmall?: string
  role?: string
}

export type TeamMap = Map<number, User>



export type BookShortInfo = {id: string, title: string}
export type BooksMap = Map<string, BookShortInfo>

export type BookPartKind = 'group' | 'module'
export type BookPart = {id?: string, number: number, kind: BookPartKind, title: string, parts?: BookPart[]}
export interface Book {
  id: string
  title: string
  parts: BookPart[]
}


export type ModuleStatus = 'ready' | 'translation' | 'review' | 'done'
export type ModuleShortInfo = {id: string, title: string, book: string, assignee: number | null, status: ModuleStatus}
export type ModulesMap = Map<string, ModuleShortInfo>



export type DraftShortInfo = { module: string, title: string }



export type NotificationStatus = 'unread' | 'read'
export type NotificationKind = 'comment' | 'mention' | 'assigned'
export type Notification = {
  user: number
  status: NotificationStatus
  kind: NotificationKind
  who: number
  message?: string
  module?: string
  conversation?: string
}


export type AlertKind = 'success' | 'error' | 'warning' | 'info'
export type Alert = {
  id: number
  message: string
  kind: AlertKind
}
