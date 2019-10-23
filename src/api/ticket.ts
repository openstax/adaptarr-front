import axios from 'src/config/axios'
import { AxiosResponse } from 'axios'

import Base from './base'
import { ConversationData } from './conversation'

export type TicketID = string

export type TicketData = {
  id: TicketID
  title: string
  opened: string
  conversation: ConversationData
}

export default class Ticket extends Base<TicketData> {
  /**
   * Load information about Ticket with given id.
   */
  static async load(id: string): Promise<Ticket> {
    const res = await axios.get(`/support/tickets/${id}`)
    return new Ticket(res.data)
  }

  /**
   * Load all tickets. If @param my is set to true it will return only tickets
   * created by user. If it's set to false it will load all Tickets
   * (only for members of support team).
   */
  static async all(my = false): Promise<Ticket[]> {
    const res = await axios.get(`support/tickets${my ? '/my' : ''}`)
    return res.data.map((ticket: TicketData) => new Ticket(ticket))
  }

  /**
   * Create new ticket with specific title.
   */
  static async create(title: string): Promise<Ticket> {
    const res = await axios.post('support/tickets', { title })
    return new Ticket(res.data)
  }

  /**
   * ID of this ticket.
   */
  id: TicketID

  /**
   * Title of this ticket.
   */
  title: string

  /**
   * Date and time when this ticked was opened.
   */
  opened: Date

  /**
   * List of IDs of this ticket's authors,
   */
  authors: number[]

  /**
   * ID of conversation associated with this ticket.
   */
  conversation: ConversationData

  constructor(data: TicketData) {
    super(data)

    this.opened = new Date(data.opened)
  }

  /**
   * Update title of ticket.
   * This endpoint is available only for members of support team.
   */
  update(title: string): Promise<AxiosResponse<TicketData>> {
    return axios.put(`support/tickets/${this.id}`, { title })
  }

  /**
   * Join the conversation associated with this ticket.
   * This endpoint is only available to members of the support team.
   */
  join(): Promise<AxiosResponse> {
    return axios.post(`support/tickets/${this.id}/join`)
  }
}
