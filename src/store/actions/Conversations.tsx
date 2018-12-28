import axios from 'src/config/axios'

import { SET_CONVERSATION, PUSH_MSG_TO_CONVERSATION } from 'src/store/constants'
import { Conversation, Message } from 'src/store/types'

export interface FetchConversation {
  (dispatch: any): void
}

export interface AddMessage {
  (dispatch: any): void
}

export interface SetConversation {
  type: SET_CONVERSATION,
  data: Conversation,
}

export interface PushMsgToConversation {
  type: PUSH_MSG_TO_CONVERSATION,
  data: Message,
}

export type ConversationsAction = SetConversation | PushMsgToConversation

export const fetchConversation = (id: string): FetchConversation => {
  return (dispatch: React.Dispatch<SetConversation>) => {
    /* axios.get(`conversations/${id}`)
      .then(res => {
        dispatch(setConversation(res.data))
      })
      .catch(e => {
        console.log('fetchConversation():', e.message)
        throw new Error(e.message)
      }) */
    dispatch(setConversation({
      info: {title: 'Json Cook', timestamp: new Date().toISOString()},
      messages: [
        {
          user: {
            id: 1,
            name: 'adaptarr',
          },
          message: 'Error corrupti dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis.',
          timestamp: new Date().toISOString(),
        },
        {
          user: {
            id: 2,
            name: 'Test',
          },
          message: 'Error corrupti [MENTION adaptarr 1] dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis.',
          timestamp: new Date().toISOString(),
        },
        {
          user: {
            id: 2,
            name: 'Test',
          },
          message: 'Error corrupti dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis.',
          timestamp: new Date().toISOString(),
        },
        {
          user: {
            id: 1,
            name: 'adaptarr',
          },
          message: 'Error corrupti dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis.',
          timestamp: new Date().toISOString(),
        },
        {
          user: {
            id: 1,
            name: 'adaptarr',
          },
          message: 'Error corrupti [MENTION Test 2] dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis.',
          timestamp: new Date().toISOString(),
        },
        {
          user: {
            id: 2,
            name: 'Test',
          },
          message: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error corrupti dolor ea nam perspiciatis [MENTION Test 2]veniam animi non nobis[MENTION adaptarr 1]culpa, dignissimos, veritatis facilis fugiat nemo asperiores odit voluptatibus ratione neque minima.',
          timestamp: new Date().toISOString(),
        },
      ]
    }))
  }
}

export const addMessage = (conversationId: string, msg: Message): AddMessage => {
  return (dispatch: React.Dispatch<PushMsgToConversation>) => {
    /* axios.put(`conversations/messages/${conversationId}`, msg)
      .then(() => {
        dispatch(pushMsgToConversation(msg))
      })
      .catch(e => {
        console.log('addMessage():', e.message)
        throw new Error(e.message)
      }) */
    dispatch(pushMsgToConversation(msg))
  }
}

export const setConversation = (conversation: Conversation): SetConversation => {
  return {
    type: SET_CONVERSATION,
    data: conversation,
  }
}

export const pushMsgToConversation = (msg: Message): PushMsgToConversation => {
  return {
    type: PUSH_MSG_TO_CONVERSATION,
    data: msg,
  }
}
