import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Ticket, { TicketID } from 'src/api/ticket'

import TicketComp from '../Ticket'

import './index.css'

interface TicketsListProps {
  tickets: Ticket[]
  onTicketClick?: (ticket: Ticket) => void
}

const TicketsList = ({ tickets, onTicketClick }: TicketsListProps) => {
  const handleTicketClick = (ticket: Ticket) => {
    if (onTicketClick) {
      onTicketClick(ticket)
    }
  }

  return (
    <ul className="tickets__list">
      {
        tickets.length
          ? tickets.map(ticket => (
            <li key={ticket.id} className="tickets__list-item">
              <TicketComp
                ticket={ticket}
                onTicketClick={handleTicketClick}
              />
            </li>
          ))
          : <li className="tickets__list-item tickets__list-item--no-tickets">
            <Localized id="tickets-no-tickets">
              No tickets were found
            </Localized>
          </li>
      }
    </ul>
  )
}

export default TicketsList
