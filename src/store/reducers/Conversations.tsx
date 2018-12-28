import { ConversationInfo, Message } from 'src/store/types'
import { ConversationsAction } from 'src/store/actions/Conversations'
import {
  SET_CONVERSATION,
  PUSH_MSG_TO_CONVERSATION,
} from 'src/store/constants'

export interface State {
  info: ConversationInfo
  messages: Message[]
}

export const initialState: State = {
  info: { title: '...', timestamp: '....' },
  messages: [],
}

export function reducer (state: State = initialState, action: ConversationsAction) {
  switch (action.type) {
    case SET_CONVERSATION:
      return {
        ...state,
        info: action.data.info,
        messages: action.data.messages,
      }
    case PUSH_MSG_TO_CONVERSATION:
      let messages = state.messages
      messages.push(action.data)
      return {
        ...state,
        messages,
      }
  }
  return state
}
