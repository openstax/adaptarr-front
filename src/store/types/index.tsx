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

export type ReferenceTargetType
  = 'commentary'
  | 'example'
  | 'exercise'
  | 'figure'
  | 'note'
  | 'solution'
  | 'subfigure'
export type ReferenceTarget = {
  id: string,
  type: ReferenceTargetType,
  description: string | null,
  counter: number,
  children: ReferenceTarget[],
}
export type ReferenceTargets = Map<string, ReferenceTarget[]>

export type NotificationStatus = 'read' | 'unread'

export type DraftShortInfo = { module: string, title: string }



export type AlertDataKind = 'success' | 'error' | 'warning' | 'info'

export type AlertData = {
  kind: AlertDataKind
  message: string
  arguments: object
}

export type AlertKind = 'alert' | 'notification'

export type AlertInfo = {
  id: number
  kind: 'alert'
  data: AlertData
}

export type AlertNotification = {
  id: number
  kind: 'notification'
  data: Notification
}

export type Alert = AlertInfo | AlertNotification



export type ConversationInfo = { title: string, timestamp: string, }
export type Message = { user: User, message: string, timestamp: string, }
export type Conversation = {
  info: ConversationInfo
  messages: Message[]
}
