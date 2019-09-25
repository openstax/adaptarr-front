import * as React from 'react'

import Draft from 'src/api/draft'

import { addAlert } from 'src/store/actions/alerts'
import store from 'src/store'

import EditableText from 'src/components/EditableText'

import './index.css'

type Props = {
  draft: Draft
}

class Title extends React.Component<Props> {
  state: {
    titleInput: string
  } = {
    titleInput: this.props.draft.title,
  }

  private changeTitle = async (newTitle: string) => {
    this.setState({ titleInput: newTitle })

    try {
      await this.props.draft.updateTitle(newTitle)
      store.dispatch(addAlert('success', 'editor-document-title-save-alert-success'))
    } catch (e) {
      store.dispatch(addAlert('error', 'editor-document-title-save-alert-error'))
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
    const { draft } = this.props
    const permissions = draft.permissions || []
    const viewPermission = permissions.length === 0 || permissions.every(p => p === 'view')

    return (
      <div className="draft__title">
        {
          viewPermission ?
            titleInput
          : <EditableText text={titleInput} onAccept={this.changeTitle} />
        }
      </div>
    )
  }
}

export default Title
