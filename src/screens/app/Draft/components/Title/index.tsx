import * as React from 'react'

import i18n from 'src/i18n'
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
      store.dispatch(addAlert('success', i18n.t('Draft.title.save.success')))
    } catch (e) {
      store.dispatch(addAlert('error', i18n.t('Draft.title.save.error')))
      console.error(e)
    }
  }

  public render() {
    const { titleInput } = this.state

    return (
      <form onSubmit={this.changeTitle}>
        <span className="draft__title">
          <Input
            value={titleInput}
            placeholder={i18n.t('Draft.title.placeholder')}
            onChange={this.updateTitleInput}
          />
        </span>
      </form>
    )
  }
}

export default Title