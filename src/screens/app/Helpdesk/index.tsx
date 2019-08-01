import * as React from 'react'
import { connect } from 'react-redux'

import Conversation, { ConversationData } from 'src/api/conversation'

import store from 'src/store'
import { State } from 'src/store/reducers'
import { createConversation, openConversation } from 'src/store/actions/Conversations'

import Header from 'src/components/Header'
import Section from 'src/components/Section'
import Spinner from 'src/components/Spinner'
import HelpdeskTools from './components/HelpdeskTools'

import Chat from 'src/containers/Chat'

import './index.css'

type Props = {
  conversations: Map<number, ConversationData>
  sockets: Map<number, Conversation>
}

const mapStateToProps = ({ conversations: { conversations, sockets } }: State) => {
  return {
    conversations,
    sockets,
  }
}

class Helpdesk extends React.Component<Props> {
  state: {
    conversation: Conversation | undefined
  } = {
    conversation: undefined,
  }

  private startHelpdeskConversation = () => {
    // TODO: This should check for helpdesk conversation instead of 123
    if (this.props.conversations.has(2)) {
      if (this.props.sockets.has(2)) {
        const conversation = this.props.sockets.get(2)!
        this.setState({ conversation })
      } else {
        store.dispatch(openConversation(2))
      }
    } else {
      // This should create helpdesk conversation instead of hardocded one
      store.dispatch(createConversation([1, 2]))
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.conversations.size !== this.props.conversations.size
      || prevProps.sockets.size !== this.props.sockets.size
      ) {
        this.startHelpdeskConversation()
      }
  }

  componentDidMount () {
    this.startHelpdeskConversation()
  }

  public render() {
    const { conversation } = this.state

    return (
      <div className="container container--splitted helpdesk">
        <Section>
          <Header l10nId="helpdesk-view-title" title="Helpdesk" />
          <div className="section__content">
            <HelpdeskTools />
          </div>
        </Section>
        <Section>
          <Header l10nId="helpdesk-view-chat-title" title="Chat" />
          {
            conversation ?
              <Chat conversation={conversation} />
            : <Spinner/>
          }
        </Section>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Helpdesk)
