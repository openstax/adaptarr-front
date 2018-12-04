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
  isLoading: boolean
  books: {id: string, title: string}[]
  assigned: {id: string, title: string, book: string}[]
  drafts: string[]
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
