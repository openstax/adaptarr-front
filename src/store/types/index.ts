import { Book, Module, Notification, User } from 'src/api'
import Team, { TeamID } from 'src/api/team'

export type IsLoading = boolean
export type RequestStatus = {status: string, message?: string | {}}


export type UsersMap = Map<number, User>
export type TeamsMap = Map<TeamID, Team>


export type BooksMap = Map<string, Book>

export type BookPartKind = 'group' | 'module'
export type BookPart = {
  id?: string
  number: number
  kind: BookPartKind
  title: string
  parts?: BookPart[]
}
export interface BookPartModule extends BookPart {
  status: ModuleStatus
  assignee?: User
}
export interface BookPartGroup extends BookPart {
  modStatuses: ModuleStatus[]
}
export type BookParts = (BookPart | BookPartGroup | BookPartModule)[]


export type ModuleID = string
export interface ModuleLabelData {
  name: string
  color: string
}
export interface ModuleLabelProperites {
  name?: string
  color?: string
}
export type LabelID = string
export interface ModuleLabel extends ModuleLabelData {
  id: LabelID
}
// We are using object because we will store those in localStorage until we decide
// if we want to develop this feature further and transfer it to backend.
export type Labels = { [key: string /* LabelID */]: ModuleLabel }
export type ModulesWithLabels = { [key: string /* ModuleID */]: LabelID[] }

export type ModuleStatus = 'ready' | 'translation' | 'review' | 'done'
export type Module = {
  id: ModuleID
  title: string
  book: string
  assignee: number | null
  status: ModuleStatus
}
export type ModulesMap = Map<ModuleID, Module>

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
