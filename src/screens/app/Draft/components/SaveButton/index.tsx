import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Trans } from 'react-i18next'
import { Value } from 'slate'
import { DocumentDB } from 'cnx-designer'

import i18n from 'src/i18n'
import Storage from 'src/api/storage'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Spinner from 'src/components/Spinner'

import { addAlert } from 'src/store/actions/Alerts'
import store from 'src/store'

import './index.css'

export type Props = {
  value: Value,
}

export default class SaveButton extends React.Component<Props> {
  static contextTypes = {
    storage: PropTypes.instanceOf(Storage),
    documentDb: PropTypes.instanceOf(DocumentDB),

  }

  state: {
    saving: boolean,
  } = {
    saving: false,
  }

  render() {
    const { storage } = this.context
    const { value } = this.props
    const { saving } = this.state

    return (
      <Button
        className="save-button"
        clickHandler={this.onClick}
        isDisabled={saving || storage.current(value)}
        size="medium"
      >
        <Icon name="save" />
        <Trans i18nKey="Editor.save.action" />
        {saving && <Spinner />}
      </Button>
    )
  }

  private onClick = async () => {
    const { storage, documentDb } = this.context
    const { value } = this.props

    this.setState({ saving: true })

    try {
      await storage.write(value)
      // TODO: get version from API
      await documentDb.save(value, Date.now().toString())
    } catch (ex) {
      store.dispatch(addAlert('error', i18n.t('Editor.save.error') ))
      console.error(ex)
    }

    this.setState({ saving: false })
  }
}
