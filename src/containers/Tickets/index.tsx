import * as React from 'react'

import { Ticket } from 'src/api'

import TicketManager from './components/TicketManager'
import TicketCreator from './components/TicketCreator'
import TicketsList from './components/TicketsList'
import Spinner from 'src/components/Spinner'

const Tickets = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)

  const addTicket = (ticket: Ticket) => {
    setTickets([ticket, ...tickets])
  }

  const onTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
  }

  const unselectTicket = () => {
    setSelectedTicket(null)
  }

  const fetchTickets = async () => {
    setTickets(await Ticket.all())
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchTickets()
  }, [])

  return (
    <div className="tickets">
      {
        selectedTicket
          ? <TicketManager ticket={selectedTicket} onCloseChat={unselectTicket} />
          : <>
            <TicketCreator onCreate={addTicket} />
            {
              isLoading
                ? <Spinner />
                : <TicketsList tickets={tickets} onTicketClick={onTicketClick} />
            }
          </>
      }
    </div>
  )
}

export default Tickets
