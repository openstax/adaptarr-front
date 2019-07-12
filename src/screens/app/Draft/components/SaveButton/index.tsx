import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Value } from 'slate'
import { DocumentDB } from 'cnx-designer'

import Storage from 'src/api/storage'
import saveAsFile from 'src/helpers/saveAsFile'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'
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
    showErrorDialog: boolean,
    error: string,
    showAfterExportDialog: boolean,
  } = {
    saving: false,
    showErrorDialog: false,
    error: '',
    showAfterExportDialog: false,
  }

  render() {
    const { document, glossary, storage } = this.props
    const { saving, showErrorDialog, error, showAfterExportDialog } = this.state

    return (
      <>
        <Button
          className="save-button"
          clickHandler={this.onClick}
          isDisabled={saving || storage.current(document, glossary)}
          withBorder={true}
        >
          <Icon size="small" name="save" />
          <Localized id="editor-tools-save">Save</Localized>
          {saving && <Spinner />}
        </Button>
        {
          showErrorDialog ?
            <Dialog
              size="medium"
              l10nId="editor-tools-save-error-title"
              placeholder="We couldn't save this document"
              onClose={this.closeErrorDialog}
            >
              <Localized id="editor-tools-save-error-content" p={<p/>} $error={error}>
                <div className="save-button__dialog-content"></div>
              </Localized>
              <div className="dialog__buttons dialog__buttons--center">
                <Button clickHandler={this.exportDocument}>
                  <Localized id="editor-tools-save-error-export">
                    Export document
                  </Localized>
                </Button>
              </div>
            </Dialog>
          : null
        }
        {
          showAfterExportDialog ?
            <Dialog
              size="medium"
              l10nId="editor-tools-save-export-title"
              placeholder="Please send downloaded file to the administrator so he can fix your problem."
              onClose={this.closeAfterExportDialog}
            >
              <div className="dialog__buttons dialog__buttons--center">
                <Button clickHandler={this.closeAfterExportDialog}>
                  <Localized id="editor-tools-save-export-ok">
                    Ok
                  </Localized>
                </Button>
              </div>
            </Dialog>
          : null
        }
      </>
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
      store.dispatch(addAlert('success', 'editor-tools-save-alert-success'))
    } catch (ex) {
      this.setState({ showErrorDialog: true, error: ex.toString() })
    }

    this.setState({ saving: false })
  }

  private closeErrorDialog = () => {
    this.setState({ showErrorDialog: false })
  }

  private exportDocument = () => {
    const { document, glossary, isGlossaryEmpty, storage } = this.props
    const filename = `${storage.title}_${storage.id}.json`.replace(/\s+/g, '_')
    const content = {
      documentValue: document.toJSON(),
      glossaryValue: isGlossaryEmpty ? null : glossary.toJSON(),
    }
    saveAsFile(filename, JSON.stringify(content, null, 2), 'application/json')
    this.setState({ showErrorDialog: false, showAfterExportDialog: true })
  }

  private closeAfterExportDialog = () => {
    this.setState({ showAfterExportDialog: false })
  }
}
