import * as React from 'react'
import { useSelector } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { Ticket } from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { fetchConversationsMap, openConversation } from 'src/store/actions/conversations'
import { State } from 'src/store/reducers'

import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import InputEditor from 'src/containers/Chat/components/InputEditor'

import './index.css'

interface TicketCreatorProps {
  onCreate: (ticket: Ticket) => void
  onClose: () => void
}

// When user hit enter his message is saved in firstMsgToSend
// and new ticket is created. When it's successfull it will be set in newTicket.
// When this happen newConversation will be obtained from redux store.
// If there is no socket for this converation it will be created with openConversation.
// If there is newSocket and firstMsgToSend, it will be sent and onCreate will be called,
// which should close TicketCreator and open Chat.
const TicketCreator = ({ onCreate, onClose }: TicketCreatorProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [newTicket, setNewTicket] = React.useState<Ticket | null>(null)
  const [firstMsgToSend, setFirstMsgToSend] = React.useState<Uint8Array | null>(null)
  const {
    conversations,
    sockets,
  } = useSelector((state: State) => state.conversations)
  const newConversation = newTicket ? conversations.get(newTicket.conversation.id) : undefined
  const newSocket = newConversation ? sockets.get(newConversation.id) : undefined

  if (newConversation && !newSocket) {
    store.dispatch(openConversation(newConversation.id))
  }

  if (newSocket && firstMsgToSend) {
    newSocket.sendMessage(firstMsgToSend)
    onCreate(newTicket!)
  }

  const onEnter = async (msg: Uint8Array, text: string) => {
    setIsLoading(true)
    setFirstMsgToSend(msg)

    await Ticket.create(text.trim().substring(0, 20))
      .then(ticket => {
        store.dispatch(fetchConversationsMap())
        setNewTicket(ticket)
      })
      .catch(() => {
        store.dispatch(addAlert('error', 'tickets-create-new-error'))
      })
  }

  return (
    <div className="tickets__creator">
      <div className="tickets__controls">
        <Button clickHandler={onClose}>
          <Icon size="small" name="arrow-left" />
        </Button>
        <h2>
          <Localized id="tickets-create-new-title">
            Describe your problem and hit enter
          </Localized>
        </h2>
      </div>
      {
        isLoading
          ? <Spinner />
          : <InputEditor onEnter={onEnter} />
      }
    </div>
  )
}

export default TicketCreator
