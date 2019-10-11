import * as React from 'react'
import * as PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ReactLocalization } from 'fluent-react/compat'

import { User } from 'src/api'

import { State } from 'src/store/reducers'

import Avatar from 'src/components/ui/Avatar'

interface HighlightContentProps {
  text: string
  // Id of user which created this highlight
  creator: number
  loggedUser: User
  onUpdate: (text: string) => void
}

const mapStateToProps = ({ user: { user } }: State) => ({
  loggedUser: user,
})

interface HighlightContentState {
  text: string
}

class HighlightContent extends React.Component<HighlightContentProps> {
  state: HighlightContentState = {
    text: this.props.text,
  }

  static contextTypes = {
    uiL10n: PropTypes.instanceOf(ReactLocalization),
  }

  private onChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const text = (e.target as HTMLTextAreaElement).value
    this.setState({ text })
    this.props.onUpdate(text)
  }

  public render() {
    const { text } = this.state
    const { loggedUser, creator } = this.props
    const onlyView = loggedUser.id !== creator
    const placeholder = this.context.uiL10n.getString('editor-highlight-message-placeholder')

    return (
      <span
        className="highlight__content"
        contentEditable={false}
      >
        {
          onlyView
          ?
          <>
            <span className="highlight__message">
              {text}
            </span>
            <span className="highlight__author">
              <Avatar size="small" withName={true} user={creator} />
            </span>
          </>
          :
          <textarea
            onChange={this.onChange}
            value={text}
            placeholder={placeholder}
            rows={5}
          />
        }
      </span>
    )
  }
}

export default connect(mapStateToProps)(HighlightContent)
