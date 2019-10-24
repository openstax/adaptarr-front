import * as React from 'react'
import { useSelector } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import Conversation, {
  DateSeparator as DateSeparatorType,
  LoadingMessages as LoadingMessagesType,
  UserJoined as UserJoinedType,
  UserMessages as UserMessagesType,
} from 'src/api/conversation'

import store from 'src/store'
import { replaceLoadingMessage } from 'src/store/actions/conversations'
import { State } from 'src/store/reducers'

import { isSameDay } from 'src/helpers'

import Message from '../Message'
import Avatar from 'src/components/ui/Avatar'
import { Link } from 'react-router-dom'

interface UserMessagesProps {
  data: UserMessagesType
  selectedMsg: number
}

export const UserMessages = ({ data, selectedMsg }: UserMessagesProps) => {
  const { userId, messages } = data

  return (
    <div className="chat__msg">
      <div className="chat__msg-header">
        <span className="chat__msg-user">
          <Avatar size="small" user={userId} withName={true} />
        </span>
        <Time time={messages[0].time} />
      </div>
      <div className="chat__msg-content">
        {
          messages.map(({ id, time, message }) => (
            <div
              key={id}
              id={`msg-${id}`}
              className={
                `chat__msg-single ${id === selectedMsg ? 'chat__msg-single--selected' : ''}`
              }
            >
              <Time time={time} />
              <Message data={new Uint8Array(message)} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export const DateSeparator = ({ data: { date } }: { data: DateSeparatorType }) => {
  const today = new Date()
  const isToday = isSameDay(today, date)
  const isYesterday = isSameDay(new Date(today.setDate(today.getDate() - 1)), date)
  return (
    <div className="chat__date-separator">
      <span className="date">
        {
          isToday ?
            <Localized id="chat-today">Today</Localized>
            : isYesterday ?
              <Localized id="chat-yesterday">Yesterday</Localized>
              : new Intl.DateTimeFormat(
                'default', { weekday: 'long', month: 'short', day: 'numeric' }).format(date)
        }
      </span>
    </div>
  )
}

const Time = ({ time }: { time?: Date }) => (
  <span className="chat__msg-time">
    {
      new Intl.DateTimeFormat(
        'default', { hour: '2-digit', minute: '2-digit' }).format(time)
    }
  </span>
)


interface LoadingMessagesProps {
  data: LoadingMessagesType
  isInView: boolean
  conversation: Conversation
  chatContainer: HTMLDivElement
}

export const HISTORY_LIMIT = 20

/**
 * This component is waitng for prop @param isInView to become true.
 * When this happen it will fetch proper messages and reducer
 * should remove it from conversation messages.
 */
export class LoadingMessages extends React.Component<LoadingMessagesProps> {
  state: {
    isLoading: boolean
  } = {
    isLoading: false,
  }

  componentDidMount() {
    if (this.props.isInView) {
      this.loadMessages()
    }
  }

  componentDidUpdate(prevProps: LoadingMessagesProps) {
    if (!this.state.isLoading && !prevProps.isInView && this.props.isInView) {
      this.loadMessages()
    }
    if (prevProps.data.id !== this.props.data.id) {
      if (!prevProps.isInView && this.props.isInView) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ isLoading: false })
      }
    }
  }

  msg = React.createRef<HTMLDivElement>()

  public render() {
    const { data: { id, refId, direction } } = this.props

    return (
      <div
        ref={this.msg}
        className="chat__msg chat__msg--info chat__msg--loading"
        data-id={id}
        data-ref={refId}
        data-direction={direction}
      >
        <Localized id="chat-message-loading-messages">
          Loading messages...
        </Localized>
      </div>
    )
  }

  private loadMessages = async () => {
    const { conversation, data: { id, refId, direction }, chatContainer } = this.props

    const numBefore = direction === 'before' ? HISTORY_LIMIT : 0
    const numAfter = direction === 'after' ? HISTORY_LIMIT : 0
    const { before, after } = await conversation.getHistory(refId, numBefore, numAfter)
    const ref = refId ? after.shift() : undefined

    let isLoadingDone = false

    switch (direction) {
    case 'before':
      if (numBefore > 0 && before.length < numBefore) {
        isLoadingDone = true
      }
      break

    case 'after':
      if (numAfter > 0 && after.length < numAfter) {
        isLoadingDone = true
      }
      break

    default:
      console.warn(`Unknown direction: ${direction} in loadMessages().`)
    }

    const scrollHeightBeforeMsgAdd = chatContainer.scrollHeight
    const scrollFromTop = chatContainer.scrollTop
    const scrollFromBottom = scrollHeightBeforeMsgAdd - scrollFromTop - chatContainer.offsetHeight

    store.dispatch(replaceLoadingMessage(conversation.id, {
      before,
      after,
      ref,
      loadingMsgId: id,
      isLoadingDone,
    }))

    const scrollHeightAfterMsgAdd = chatContainer.scrollHeight

    // Newest messages were requested. Scroll to the bottm.
    if (refId === 0) {
      chatContainer.scrollBy(0, scrollHeightAfterMsgAdd)
      return
    }

    // Scroll to the refMsg and adjust scroll position by scrollTop or scrollBottom
    // depends on loading direction.
    const refMsg = document.getElementById(`msg-${refId}`)
    if (refMsg) {
      if (direction === 'before') {
        // If messages were added to the top of loading message then we have to
        // keep scrollFromBottom position.
        // eslint-disable-next-line max-len
        chatContainer.scrollTop = scrollHeightAfterMsgAdd - scrollFromBottom - chatContainer.offsetHeight
      } else if (direction === 'after') {
        // If messages were added after loading message then we have to
        // keep old scrollFromTop position.
        chatContainer.scrollTop = scrollFromTop
      }
    }
  }
}

export const UserJoined = ({ data: { id, users } }: { data: UserJoinedType }) => {
  const usersMap = useSelector((state: State) => state.user.users)

  return (
    <div className="chat__msg chat__msg--user-joined" data-id={id}>
      {
        users.length > 1
          ? <>
            <Localized id="chat-users-joined">
              New users has joined:
            </Localized>
            {
              users.map(usrId => (
                <Link key={usrId} to={`/users/${usrId}`}>{usersMap.get(usrId)!.name}</Link>
              ))
            }
          </>
          :
          <Localized
            id="chat-user-joined"
            $user={usersMap.get(users[0])!.name}
            anchor={<Link to={`/users/${users[0]}`}/>}
          >
            {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
            <></>
          </Localized>
      }
    </div>
  )
}
