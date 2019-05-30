import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Value } from 'slate'
import { DocumentDB } from 'cnx-designer'

import Storage from 'src/api/storage'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Spinner from 'src/components/Spinner'

import { addAlert } from 'src/store/actions/Alerts'
import store from 'src/store'

import './index.css'

export type Props = {
  document: Value,
  glossary: Value,
  isGlossaryEmpty: boolean,
  storage: Storage,
  documentDbContent: DocumentDB,
  documentDbGlossary: DocumentDB,
}

export default class SaveButton extends React.Component<Props> {
  state: {
    saving: boolean,
  } = {
    saving: false,
  }

  render() {
    const { document, glossary, storage } = this.props
    const { saving } = this.state

    return (
      <Button
        className="save-button"
        clickHandler={this.onClick}
        isDisabled={saving || storage.current(document, glossary)}
        size="medium"
      >
        <Icon name="save" />
        <Localized id="editor-tools-save">Save</Localized>
        {saving && <Spinner />}
      </Button>
    )
  }

  private onClick = async () => {
    const { document, glossary, isGlossaryEmpty, storage, documentDbContent, documentDbGlossary } = this.props

    this.setState({ saving: true })

    try {
      await storage.write(document, isGlossaryEmpty ? null : glossary)
      // TODO: get version from API
      await documentDbContent.save(document, Date.now().toString())
      await documentDbGlossary.save(glossary, Date.now().toString())
    } catch (ex) {
      store.dispatch(addAlert('error', 'editor-tools-save-alert-error'))
      console.error(ex)
    }

    this.setState({ saving: false })
  }
}
