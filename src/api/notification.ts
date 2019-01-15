import axios from 'src/config/axios'

import Base from './base'

export type NotificationData = AssignedData

export type Kind = 'assigned'

export type AssignedData = {
  kind: 'assigned',
  id: number,
  timestamp: string,
  module: string,
  who: number,
}

export default class Notification extends Base<NotificationData> {
  /**
   * Fetch list of all unread notifications.
   */
  static async unread(): Promise<Notification[]> {
    const rsp = await axios.get('notifications')
    return rsp.data.map((data: NotificationData) => new Notification(data))
  }

  /**
   * What kind of notification this is.
   */
  kind: Kind

  /**
   * Notification's ID.
   */
  id: number

  /**
   * Time at which this notification was created.
   */
  timestamp: string

  /**
   * Module which is the object of this notification.
   *
   * This field is present if {@link #kind} is {@code 'assigned'}.
   */
  module?: string

  /**
   * User which is the subject of this notification.
   *
   * This field is present if {@link #kind} is {@code 'assigned'}.
   */
  who?: number

  /**
   * Mark this notification as read.
   */
  async markRead(): Promise<void> {
    await axios.put(`notifications/${this.id}`, { unread: false })
  }
}
