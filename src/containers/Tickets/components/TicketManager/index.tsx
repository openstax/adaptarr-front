import * as React from 'react'
import { useSelector } from 'react-redux'

import { Conversation, Ticket } from 'src/api'

import store from 'src/store'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/alerts'
import { openConversation } from 'src/store/actions/conversations'

import TicketOpenDate from '../TicketOpenDate'
import Chat from 'src/containers/Chat'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

interface TicketManagerProps {
  ticket: Ticket
  onCloseChat: () => void
}

const TicketManager = ({ ticket, onCloseChat }: TicketManagerProps) => {
  const [conversation, setConversation] = React.useState<Conversation | null>(null)
  const {
    conversations,
    sockets,
  } = useSelector((state: State) => state.conversations)

  const closeChat = () => {
    onCloseChat()
  }

  const openChat = (convId: number) => {
    if (conversations.has(convId)) {
      if (sockets.has(convId)) {
        const conversation = sockets.get(convId)!
        setConversation(conversation)
      } else {
        store.dispatch(openConversation(convId))
      }
    } else {
      store.dispatch(addAlert('error', 'tickets-conversation-not-found'))
    }
  }

  React.useEffect(() => {
    if (!conversation || conversation.id !== ticket.conversation.id) {
      openChat(ticket.conversation.id)
    }
  })

  return (
    <div className="tickets__manager">
      <div className="tickets__controls">
        <div className="tickets__constrols--group">
          <Button clickHandler={closeChat}>
            <Icon size="small" name="arrow-left" />
          </Button>
          <span className="tickets__title">{ticket.title}</span>
        </div>
        <TicketOpenDate date={ticket.opened} />
      </div>
      {
        conversation
          ? <Chat conversation={conversation} />
          : <Spinner />
      }
    </div>
  )
}

export default TicketManager
