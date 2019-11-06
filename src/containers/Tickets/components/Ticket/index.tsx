import * as React from 'react'
import { useSelector } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { Ticket as TicketClass } from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { fetchConversationsMap } from 'src/store/actions/conversations'
import { State } from 'src/store/reducers'

import { confirmDialog } from 'src/helpers'

import TicketOpenDate from '../TicketOpenDate'
import Avatar from 'src/components/ui/Avatar'

import './index.css'

interface TicketProps {
  ticket: TicketClass
  onTicketClick?: (ticket: TicketClass) => void
}

const Ticket = ({ ticket, onTicketClick }: TicketProps) => {
  const [otherMembers, setOtherMembers] = React.useState(
    ticket.conversation.members.filter(mId => ticket.authors.indexOf(mId) === -1)
  )
  const user = useSelector((state: State) => state.user.user)

  const onClick = () => {
    if (onTicketClick) {
      if (ticket.conversation.members.indexOf(user.id) >= 0) {
        onTicketClick(ticket)
      } else {
        joinTicket()
      }
    }
  }

  const joinTicket = async () => {
    const res = await confirmDialog({
      title: 'tickets-join-ticket-confirm',
      $ticket: ticket.title,
      size: 'medium',
      buttons: {
        cancel: 'tickets-join-cancel',
        join: 'tickets-join-ticket',
      },
    })

    if (res !== 'join') return

    await ticket.join().then(() => {
      store.dispatch(fetchConversationsMap())
      ticket.conversation.members.push(user.id)
      setOtherMembers([...otherMembers, user.id])
    })
      .catch(() => {
        store.dispatch(addAlert('error', 'tickets-join-error'))
      })
  }

  return (
    <div
      className="ticket"
      onClick={onClick}
    >
      <div className="ticket__title">{ticket.title}</div>
      <div className="ticket__authors">
        <Localized id="tickets-author">
          Author:
        </Localized>
        {ticket.authors.map(authId => <Avatar key={authId} user={authId} withName={true} />)}
        <TicketOpenDate date={ticket.opened} />
      </div>
      {
        otherMembers.length
          ? <div className="ticket__members">
            <Localized id="tickets-other-members">
              Other members:
            </Localized>
            <div className="ticket__members__avatars">
              {otherMembers.map(memId => (
                <Avatar key={memId} user={memId} withName={true} />
              ))}
            </div>
          </div>
          : null
      }
    </div>
  )
}

export default Ticket
