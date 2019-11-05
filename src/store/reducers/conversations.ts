import Conversation, {
  ConversationData,
  ConversationMessage,
  ConversationMessageKind,
  DateSeparator,
  LoadingMessages,
  NewMessageEventData,
  UserJoined,
  UserJoinedEventData,
  UserMessages,
} from 'src/api/conversation'

import { ConversationsAction } from 'src/store/actions/conversations'
import {
  ADD_CONVERSATION,
  ADD_MESSAGE,
  ADD_MESSAGES,
  REPLACE_LOADING_MESSAGE,
  SET_CONVERSATIONS_MAP,
} from 'src/store/constants'

import { isSameDay } from 'src/helpers'

export interface State {
  conversations: Map<number, ConversationData>
  sockets: Map<number, Conversation>
  messages: Map<number, ConversationMessage[]>
}

export const initialState: State = {
  conversations: new Map(),
  sockets: new Map(),
  messages: new Map(),
}

let nextId = 0
let nextLoadingMsgId = 0

// eslint-disable-next-line default-param-last
export function reducer(state: State = initialState, action: ConversationsAction) {
  switch (action.type) {
  case ADD_CONVERSATION: {
    const { id, members } = action.data
    return {
      ...state,
      conversations: new Map(state.conversations).set(
        id,
        { id, members, knownMessages: new Set() }
      ),
      sockets: new Map(state.sockets).set(id, action.socket),
      messages: new Map(state.messages).set(
        id,
        [createMessage('message:loading', { refId: 0, direction: 'before' })]
      ),
    }
  }

  case ADD_MESSAGE: {
    const { id, userId, time, message } = action.data
    const messages = state.messages.get(action.conversationId) || []
    const convData = state.conversations.get(action.conversationId)!

    if (convData.knownMessages.has(id)) {
      return state
    }
    convData.knownMessages.add(id)


    // Last message should be always UserMessages, UserJoined
    // or undefined if there are no messages.
    // Optionally it can be LoadingMessages for a second until loading is done.
    const last = messages[messages.length - 1] as (
      UserMessages | UserJoined | LoadingMessages | undefined)

    if (!last || last.kind === 'message:loading') {
      // There was no messages so just add first with DateSeparator.
      messages.push(createMessage('message:separator', time))
      messages.push(createMessage('message:user', action.data))
    } else {
      const lastMsgTime = last.kind === 'message:userjoined'
        ? last.date
        : last.messages[last.messages.length - 1].time

      const sameDay = isSameDay(lastMsgTime, time)

      // Check if new msg is from the same user.
      if (last.kind === 'message:user' && last.userId === userId) {
        if (sameDay) {
          // If msg is from the same day as last known message, just push it.
          last.messages.push({ id, time, message })
        } else {
          // If it is from other day then add new DateSeparator and
          // push new UserMessages.
          messages.push(createMessage('message:separator', time))
          messages.push(createMessage('message:user', action.data))
        }
      } else {
        // If msg is from other user...

        // If msg is from the other day, add new DateSeparator.
        if (!sameDay) {
          messages.push(createMessage('message:separator', time))
        }

        // Push new UserMessages.
        messages.push(createMessage('message:user', action.data))
      }
    }


    return {
      ...state,
      conversation: new Map(state.conversations).set(action.conversationId, { ...convData }),
      messages: new Map(state.messages).set(action.conversationId, messages),
    }
  }

  case ADD_MESSAGES: {
    const {
      data: {
        messages,
        conversationId,
        position,
        addLoadingMsgBefore,
        addLoadingMsgAfter,
      },
    } = action
    const convData = state.conversations.get(conversationId)!
    const currentMessages = state.messages.get(conversationId) || []

    const filteredMessages = messages.filter(msg => {
      if (convData.knownMessages.has(msg.id)) return false
      convData.knownMessages.add(msg.id)
      return true
    })

    const convertedMessages = convertMsgEventsToConvMessages(filteredMessages)

    let messagesToAdd: ConversationMessage[]

    const loadingMsgBefore = createMessage('message:loading', {
      refId: filteredMessages[filteredMessages.length-1].id,
      direction: 'before',
    })
    const loadingMsgAfter = createMessage('message:loading', {
      refId: filteredMessages[0].id,
      direction: 'after',
    })
    if (position === 'start') {
      messagesToAdd = mergeMessages([
        addLoadingMsgBefore ? [loadingMsgBefore] : undefined,
        convertedMessages,
        addLoadingMsgAfter ? [loadingMsgAfter] : undefined,
        currentMessages,
      ])
    } else if (position === 'end') {
      messagesToAdd = mergeMessages([
        currentMessages,
        addLoadingMsgBefore ? [loadingMsgBefore] : undefined,
        convertedMessages,
        addLoadingMsgAfter ? [loadingMsgAfter] : undefined,
      ])
    } else {
      console.error(`Unhandled position: ${position} for ADD_MESSAGES.`)
      return state
    }

    return {
      ...state,
      conversation: new Map(state.conversations).set(conversationId, { ...convData }),
      messages: new Map(state.messages).set(conversationId, messagesToAdd),
    }
  }

  case SET_CONVERSATIONS_MAP: {
    return {
      ...state,
      conversations: action.data,
    }
  }

  case REPLACE_LOADING_MESSAGE: {
    const { conversationId, data: { before, after, ref, loadingMsgId, isLoadingDone } } = action
    let messages = state.messages.get(conversationId) || []
    const convData = state.conversations.get(conversationId)!

    let beforeLoadingMsgs: ConversationMessage[] = []
    let afterLoadingMsgs: ConversationMessage[] = []

    const indexOfLoadingMsg = messages.findIndex(
      msg => msg.kind === 'message:loading' && msg.id === loadingMsgId)
    let loadingMessageDirection = 'before'
    if (indexOfLoadingMsg > -1) {
      loadingMessageDirection = (messages[indexOfLoadingMsg] as LoadingMessages).direction

      beforeLoadingMsgs = messages.splice(0, indexOfLoadingMsg === 0 ? 0 : indexOfLoadingMsg)
      afterLoadingMsgs = messages.splice(1, messages.length)
    }

    // If message is duplicate do not add it to the conversations messages and store their ids here.
    const duplicates = new Set<number>()
    const newMessages = [...before, ref, ...after].reverse().filter(msg => {
      if (!msg) return false
      if (convData.knownMessages.has(msg.id)) {
        duplicates.add(msg.id)
        return false
      }
      convData.knownMessages.add(msg.id)
      return true
    }) as (NewMessageEventData | UserJoinedEventData)[]

    if (newMessages.length === 0) {
      // There are no new messages to add. Just delete loading message.
      messages = mergeMessages([beforeLoadingMsgs, afterLoadingMsgs])
      return {
        ...state,
        messages: new Map(state.messages).set(action.conversationId, messages),
      }
    }

    const newConvertedMessages = convertMsgEventsToConvMessages(newMessages)

    if (isLoadingDone) {
      messages = mergeMessages([
        beforeLoadingMsgs,
        newConvertedMessages,
        afterLoadingMsgs,
      ])
    } else {
      // If loading is not done then add new LoadingMessage before / after
      // or on both ends of newConvertedMessages.
      switch (loadingMessageDirection) {
      case 'before': {
        const loadingMsg = createMessage('message:loading', {
          refId: newMessages[newMessages.length-1].id,
          direction: 'before',
        })
        messages = mergeMessages([
          beforeLoadingMsgs,
          [loadingMsg],
          newConvertedMessages,
          afterLoadingMsgs,
        ])
        break
      }
      case 'after': {
        const loadingMsg = createMessage('message:loading', {
          refId: newMessages[0].id,
          direction: 'after',
        })
        messages = mergeMessages([
          beforeLoadingMsgs,
          newConvertedMessages,
          [loadingMsg],
          afterLoadingMsgs,
        ])
        break
      }
      default: {
        throw new Error(`Unknown direction for LoadingMessages: ${loadingMessageDirection}`)
      }
      }
    }

    return {
      ...state,
      conversation: new Map(state.conversations).set(action.conversationId, { ...convData }),
      messages: new Map(state.messages).set(action.conversationId, messages),
    }
  }

  default:
    return state
  }
}

type LoadingMessagesData = {
  refId: number,
  direction: 'before' | 'after',
}

/**
 * Create new ConversationMessage
 *
 * @param {ConversationMessageKind} kind 'message:separator' | 'message:user'
 * @param data Date for kind === 'message:separator', NewMessageEvent for kind === 'message:user'
 *             LoadingMessagesData for kind === 'message:loading',
 *             UserJoinedEventData for kind === 'message:userjoined'
 */
const createMessage = (
  kind: ConversationMessageKind,
  data: Date | NewMessageEventData | LoadingMessagesData | UserJoinedEventData
): ConversationMessage => {
  switch (kind) {
  case 'message:separator':
    return {
      kind,
      date: data as Date,
    }

  case 'message:userjoined':
    return {
      kind,
      id: (data as UserJoinedEventData).id,
      date: (data as UserJoinedEventData).date,
      users: (data as UserJoinedEventData).users,
    }

  case 'message:user':
    return {
      kind,
      id: nextId++,
      userId: (data as NewMessageEventData).userId,
      messages: [{
        id: (data as NewMessageEventData).id,
        time: (data as NewMessageEventData).time,
        message: (data as NewMessageEventData).message,
      }],
    }

  case 'message:loading':
    return {
      kind,
      id: 'loading-' + nextLoadingMsgId++,
      refId: (data as LoadingMessagesData).refId,
      direction: (data as LoadingMessagesData).direction,
    }

  default:
    throw new Error(`Wrong message kind: ${kind}.`)
  }
}

/**
 * Convert array of NewMessageEventData and UserJoinedEvetData objects
 * into ConversationMessage array.
 */
const convertMsgEventsToConvMessages = (
  messages: (NewMessageEventData | UserJoinedEventData)[]
): ConversationMessage[] => {
  const convertedMessages: ConversationMessage[] = []

  // We will proess every message and unshift it to the convertedMessages as proper object.
  // First element in array will be always DateSeparator. Messages will be inserted below
  // this separator if they are from the same day and above if not (new separator should be created)
  for (const msg of messages) {
    // First message should be always DateSeparator or undefined when there are no messages.
    const first = convertedMessages[0] as (DateSeparator | undefined)

    if (!first) {
      // If there were no messages just add new one.
      const date = (msg as NewMessageEventData).time
        ? (msg as NewMessageEventData).time
        : (msg as UserJoinedEventData).date

      convertedMessages.push(createMessage('message:separator', date))

      if ((msg as UserJoinedEventData).users) {
        convertedMessages.push(createMessage('message:userjoined', msg))
        continue
      }

      if ((msg as NewMessageEventData).userId) {
        convertedMessages.push(createMessage('message:user', msg))
      } else {
        convertedMessages.push(createMessage('message:userjoined', msg))
      }

      continue
    }

    const thisMsgTime = (msg as UserJoinedEventData).date || (msg as NewMessageEventData).time

    // Second message should always be UserMessages or UserJoined.
    const second = convertedMessages[1] as UserMessages | UserJoined
    const sameDay = second.kind === 'message:userjoined'
      ? isSameDay(second.date, thisMsgTime)
      : isSameDay(second.messages[second.messages.length - 1].time, thisMsgTime)

    // If msg is UserJoinedEventData determine if it is from the same day as previouse message
    // and add it to the array or create new dateseparator.
    if ((msg as UserJoinedEventData).users) {
      if (sameDay) {
        // If msg is from the same day, then take DateSeparator out,
        // add new UserJoined and put DateSeparator in.
        const separator = convertedMessages.shift()!
        convertedMessages.unshift(createMessage('message:userjoined', msg))
        convertedMessages.unshift(separator)
        continue
      }

      // If msg is from the other day, then just add it as new UserJoined
      // and create new DateSeparator.
      convertedMessages.unshift(createMessage('message:userjoined', msg))
      convertedMessages.unshift(createMessage('message:separator', thisMsgTime))

      continue
    }

    // Current message is NewMessageEventData
    const { id, userId, time, message } = msg as NewMessageEventData

    // If previous message was UserJoined then we want to add current message as new UserMessages
    if (second.kind === 'message:userjoined') {
      if (sameDay) {
        // If msg is from the same day, then take DateSeparator out,
        // add new UserMessages and put DateSeparator in.
        const separator = convertedMessages.shift()!
        convertedMessages.unshift(createMessage('message:user', msg))
        convertedMessages.unshift(separator)
        continue
      }

      // If msg is from the other day, then just add it as new UserMessages
      // and create new DateSeparator.
      convertedMessages.unshift(createMessage('message:user', msg))
      convertedMessages.unshift(createMessage('message:separator', time))

      continue
    }

    // Second message is UserMessages and current msg is NewMessageEvetData
    // We will determine if it's from the same user and from same day
    // If it is we can add this message to UserMessages.messages array

    // Check if new msg is from the same user.
    if (second.userId === userId) {
      if (sameDay) {
        // If msg is from the same day as second message, just unshift it.
        second.messages.unshift({ id, time, message })
      } else {
        // If it is from other day then add it as new UserMessages
        // and add new DateSeparator.
        convertedMessages.unshift(createMessage('message:user', msg))
        convertedMessages.unshift(createMessage('message:separator', time))
      }

      continue
    }

    // Current msg is from other user. Lets just determine if it's from same day or not.

    if (sameDay) {
      // If msg is from the same day, then take DateSeparator out,
      // add new UserMessages and put DateSeparator in.
      const separator = convertedMessages.shift()!
      convertedMessages.unshift(createMessage('message:user', msg))
      convertedMessages.unshift(separator)

      continue
    }

    // If msg is from the other day, then just add is as new UserMessages
    // and create new DateSeparator.
    convertedMessages.unshift(createMessage('message:user', msg))
    convertedMessages.unshift(createMessage('message:separator', time))
  }

  return convertedMessages
}

/**
 * Merge arrays of ConversationMessages into one.
 * This function assumess that there are no duplicates and messages are in correct order.
 */
const mergeMessages = (
  messages: ((ConversationMessage | undefined)[] | undefined)[]
): ConversationMessage[] => {
  const merged: ConversationMessage[] = []

  let currDay: Date | null = null
  for (const msgs of messages) {
    if (!msgs) continue
    for (const msg of msgs) {
      if (!msg) continue
      // Keep LoadingMessages and UserJoined
      if (
        msg.kind === 'message:loading'
        || msg.kind === 'message:userjoined'
      ) {
        merged.push(msg)
        continue
      }

      // Do not duplicate DateSeparators
      if (msg.kind === 'message:separator') {
        if (!currDay || !isSameDay(currDay, msg.date)) {
          currDay = msg.date
          merged.push(msg)
        }
        continue
      }

      // Try to merge UserMessages to previous UserMessages
      if (msg.kind === 'message:user') {
        const last = merged.pop()
        if (last && last.kind === 'message:user') {
          if (
            last.userId === msg.userId
            && (!currDay || isSameDay(currDay, msg.messages[0].time))
          ) {
            last.messages = [
              ...last.messages,
              ...msg.messages,
            ]
            merged.push(last)
            continue
          }
        }
        if (last) {
          merged.push(last)
        }
        merged.push(msg)
        continue
      }
    }
  }

  return merged
}
