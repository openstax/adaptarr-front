import { Book, Module, User, Notification } from 'src/api'

export type IsLoading = boolean
export type RequestStatus = {status: string, message?: string | {}}


export type TeamMap = Map<number, User>



export type BooksMap = Map<string, Book>

export type BookPartKind = 'group' | 'module'
export type BookPart = {id?: string, number: number, kind: BookPartKind, title: string, parts?: BookPart[]}
export interface BookPartModule extends BookPart {
  status: ModuleStatus
  assignee?: User
}
export interface BookPartGroup extends BookPart {
  modStatuses: ModuleStatus[]
}
export type BookParts = (BookPart | BookPartGroup | BookPartModule)[]


export type ModuleStatus = 'ready' | 'translation' | 'review' | 'done'
export type Module = {id: string, title: string, book: string, assignee: number | null, status: ModuleStatus}
export type ModulesMap = Map<string, Module>

export type NotificationStatus = 'read' | 'unread'

export type DraftShortInfo = { module: string, title: string }



export type RequestInfoKind = 'success' | 'error' | 'warning' | 'info'
export type RequestInfo = {
  kind: RequestInfoKind
  message: string
}

export type AlertKind = 'alert' | 'notification'

export type Alert = {
  id: number
  kind: 'alert'
  data: RequestInfo
} | {
  id: number
  kind: 'notification'
  data: Notification
}



export type ConversationInfo = { title: string, timestamp: string, }
export type Message = { user: User, message: string, timestamp: string, }
export type Conversation = {
  info: ConversationInfo
  messages: Message[]
}
