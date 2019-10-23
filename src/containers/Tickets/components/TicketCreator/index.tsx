import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { Ticket } from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { fetchConversationsMap } from 'src/store/actions/conversations'

import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'

import './index.css'

interface TicketCreatorProps {
  onCreate: (ticket: Ticket) => void
}

const TicketCreator = ({ onCreate }: TicketCreatorProps) => {
  const [title, setTitle] = React.useState('')

  const onTitleChange = (text: string) => {
    setTitle(text)
  }

  const handleCreate = async () => {
    await Ticket.create(title)
      .then(ticket => {
        store.dispatch(fetchConversationsMap())
        onCreate(ticket)
        setTitle('')
        inputRef.current!.unTouch()
      })
      .catch(() => {
        store.dispatch(addAlert('error', 'tickets-create-new-error'))
      })
  }

  const inputRef = React.useRef<Input>(null)

  return (
    <div className="tickets__creator">
      <Input
        ref={inputRef}
        value={title}
        l10nId="tickets-create-new-placeholder"
        onChange={onTitleChange}
        validation={{
          minLength: 3,
        }}
      />
      <Button
        clickHandler={handleCreate}
        isDisabled={title.length < 3}
      >
        <Localized id="tickets-create-new">
          Create new ticket
        </Localized>
      </Button>
    </div>
  )
}

export default TicketCreator
