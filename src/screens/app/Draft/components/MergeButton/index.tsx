import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Localized } from 'fluent-react/compat'
import { Value } from 'slate'
import { History } from 'history'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import Storage from 'src/api/storage'
import Draft from 'src/api/draft'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Spinner from 'src/components/Spinner'

import { addAlert } from 'src/store/actions/Alerts'
import store from 'src/store'

import './index.css'

export type Props = {
  value: Value
  history: History
}

class MergeButton extends React.Component<Props & RouteComponentProps> {
  static contextTypes = {
    storage: PropTypes.instanceOf(Storage),
  }

  state: {
    merging: boolean
  } = {
    merging: false,
  }

  render() {
    const { storage } = this.context
    const { value } = this.props
    const { merging } = this.state

    return (
      <Button
        className="merge-button"
        clickHandler={this.onClick}
        isDisabled={merging || !storage.current(value)}
        size="medium"
      >
        <Icon name="save" />
        <Localized id="editor-tools-merge">Merge</Localized>
        {merging && <Spinner />}
      </Button>
    )
  }

  private onClick = async () => {
    const { storage } = this.context

    this.setState({ saving: true })

    try {
      const draft = await Draft.load(storage.id)
      await draft.save()
      store.dispatch(addAlert('success', 'editor-tools-merge-alert-success'))
      this.props.history.push(`/modules/${storage.id}`)
    } catch (ex) {
      store.dispatch(addAlert('error', 'editor-tools-merge-alert-error'))
      console.error(ex)
      this.setState({ saving: false })
    }
  }
}

export default withRouter(MergeButton)
