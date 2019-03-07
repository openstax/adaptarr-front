import * as React from 'react'

import Draft from 'src/api/draft'

import { addAlert } from 'src/store/actions/Alerts'
import store from 'src/store'

import Input from 'src/components/ui/Input'

type Props = {
  draft: Draft
}

class Title extends React.Component<Props> {
  state: {
    titleInput: string
  } = {
    titleInput: '',
  }

  private updateTitleInput = (val: string) => {
    this.setState({ titleInput: val })
  }

  private changeTitle = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await this.props.draft.updateTitle(this.state.titleInput)
      store.dispatch(addAlert('success', 'editor-document-title-alert-save-success'))
    } catch (e) {
      store.dispatch(addAlert('error', 'editor-document-title-alert-save-error'))
      console.error(e)
    }
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.draft.title !== this.props.draft.title) {
      this.setState({ titleInput: this.props.draft.title })
    }
  }

  componentDidMount = () => {
    this.setState({ titleInput: this.props.draft.title })
  }

  public render() {
    const { titleInput } = this.state

    return (
      <form onSubmit={this.changeTitle}>
        <span className="draft__title">
          <Input
            l10nId="editor-document-title-value"
            value={titleInput}
            onChange={this.updateTitleInput}
          />
        </span>
      </form>
    )
  }
}

export default Title
