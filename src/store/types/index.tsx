export type RequestStatus = {status: string, message?: string | {}}



export interface User {
  isLoading: boolean
  id: number | null
  name: string | null
  avatar: string | null
  avatarSmall: string | null
  role: string | null
  error?: string 
}



export type BookShortInfo = {id: string, title: string}
export type BooksMap = Map<string, BookShortInfo>

export type BookPartKind = 'part' | 'module'
export type BookPart = {id: string, kind: BookPartKind, title: string, parts?: BookPart[]}
export interface Book {
  id: string
  title: string
  parts: BookPart[]
}


export type ModuleShortInfo = {id: string, title: string, book: string, assignee: number}
export type ModulesMap = Map<string, ModuleShortInfo>



export type DashboardAssignedModule = {id: string, title: string, book: string}
export type DashboardBook = {id: string, title: string}
export type DashboardDraft = string //{id: string, title: string}
export interface Dashboard {
  isLoading: boolean
  assigned: DashboardAssignedModule[]
  drafts: DashboardDraft[]
  error?: string
}



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
export interface Notifications {
  isLoading: boolean
  notifications: Notification[]
}
