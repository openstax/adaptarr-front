import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { Ticket } from 'src/api'

import TicketManager from './components/TicketManager'
import TicketCreator from './components/TicketCreator'
import TicketsList from './components/TicketsList'
import Button from 'src/components/ui/Button'
import Spinner from 'src/components/Spinner'
import SearchInput, { SearchQueries } from 'src/components/SearchInput'

import './index.css'

const Tickets = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)
  const [showTicketCreator, setShowTicketCreator] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState<SearchQueries>({ text: '' })

  const regExp = new RegExp(searchValue.text, 'gi')
  const filteredTickets = searchValue.text
    ? tickets.filter(t => t.title.match(regExp))
    : tickets

  const onSearchChange = (val: SearchQueries) => {
    setSearchValue(val)
  }

  const toggleTicketCreator = () => {
    setShowTicketCreator(!showTicketCreator)
  }

  const addTicket = (ticket: Ticket) => {
    setTickets([ticket, ...tickets])
    setShowTicketCreator(false)
    setSelectedTicket(ticket)
  }

  const closeAddTicket = () => {
    setShowTicketCreator(false)
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
          : showTicketCreator
            ? <TicketCreator onCreate={addTicket} onClose={closeAddTicket} />
            : <>
              <div className="tickets__filter">
                <SearchInput
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder="tickets-filter-placeholder"
                />
                <Button clickHandler={toggleTicketCreator}>
                  <Localized id="tickets-create-new">
                    Create new ticket
                  </Localized>
                </Button>
              </div>
              {
                isLoading
                  ? <Spinner />
                  : <TicketsList tickets={filteredTickets} onTicketClick={onTicketClick} />
              }
            </>
      }
    </div>
  )
}

export default Tickets
