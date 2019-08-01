import axios from 'src/config/axios'

import Conversation,
  {
    NewMessageEventData,
    ConversationData,
    ConversationEventData,
    ReplaceLoadingMessageData,
  } from 'src/api/conversation'

import {
  ADD_CONVERSATION,
  ADD_MESSAGE,
  ADD_MESSAGES,
  SET_CONVERSATIONS_MAP,
  REPLACE_LOADING_MESSAGE,
} from 'src/store/constants'

export interface FetchConversationsMap {
  (dispatch: any): void
}

export interface FetchConversation {
  (dispatch: any): void
}

export interface SetConversationsMap {
  type: SET_CONVERSATIONS_MAP
  data: Map<number, ConversationData>
}

export interface CreateConversation {
  (dispatch: React.Dispatch<OpenConversation>):  void
}

export interface OpenConversation {
  (dispatch: React.Dispatch<AddConversation | AddMessage>): void
}

export interface AddConversation {
  type: ADD_CONVERSATION
  data: ConversationData
  socket: Conversation
}

export interface AddMessage {
  type: ADD_MESSAGE
  data: NewMessageEventData
  conversationId: number
}

export type AddMessagesData = {
  messages: NewMessageEventData[]
  conversationId: number
  position: 'start' | 'end'
  addLoadingMsgBefore: boolean
  addLoadingMsgAfter: boolean
}

export interface AddMessages {
  type: ADD_MESSAGES
  data: AddMessagesData
}

export interface ReplaceLoadingMessage {
  type: REPLACE_LOADING_MESSAGE
  data: ReplaceLoadingMessageData
  conversationId: number
}

export type ConversationsAction = AddConversation | AddMessage | AddMessages | SetConversationsMap | ReplaceLoadingMessage

// TODO: This should handle other cases, like conversation with helpdesk
export function createConversation(members: number[]): CreateConversation {
  return async (dispatch: React.Dispatch<OpenConversation>) => {
    const data = (await axios.post('conversations', { members })).data

    dispatch(openConversation(data.id, data))
  }
}

export const openConversation = (id: number, data: ConversationData | null = null): OpenConversation => {
  return async (dispatch: React.Dispatch<any>) => {
    const socket = await new Conversation(id).connect()

    if (data == null) {
      data = await Conversation.load(id)
    }

    socket.addEventListener('newmessage', (ev: CustomEvent<ConversationEventData>) => dispatch(addMessage(ev, id)))

    dispatch(addConversation(data, socket))
  }
}

export const addConversation = (data: ConversationData, socket: Conversation): AddConversation => {
  return {
    type: ADD_CONVERSATION,
    data,
    socket,
  }
}

export const addMessage = (ev: CustomEvent<ConversationEventData>, convId: number): AddMessage => {
  return {
    type: ADD_MESSAGE,
    data: (ev.detail as NewMessageEventData),
    conversationId: convId,
  }
}

export const addMessages = (data: AddMessagesData): AddMessages => {
  return {
    type: ADD_MESSAGES,
    data,
  }
}

export const fetchConversationsMap = (): FetchConversationsMap => {
  return async (dispatch: React.Dispatch<SetConversationsMap>) => {
    Conversation.all()
      .then(convs => {
        dispatch(setConversationsMap(new Map(convs.map((conv: ConversationData): [number, ConversationData] => [conv.id, conv]))))
      })
      .catch(e => {
        console.error('fetchConversationsMap():', e.message)
        throw new Error(e)
      })
  }
}

export const setConversationsMap = (conversationsMap: Map<number, ConversationData>): SetConversationsMap => {
  return {
    type: SET_CONVERSATIONS_MAP,
    data: conversationsMap,
  }
}

export const fetchConversation = async (id: number) => {
  return await Conversation.load(id)
}

export const replaceLoadingMessage = (convId: number, data: ReplaceLoadingMessageData): ReplaceLoadingMessage => {
  return {
    type: REPLACE_LOADING_MESSAGE,
    data,
    conversationId: convId,
  }
}
