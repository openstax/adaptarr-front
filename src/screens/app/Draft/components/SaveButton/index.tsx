import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Value } from 'slate'
import { DocumentDB } from 'cnx-designer'
import { isKeyHotkey } from 'is-hotkey'

import Storage from 'src/api/storage'
import saveAsFile from 'src/helpers/saveAsFile'
import confirmDialog from 'src/helpers/confirmDialog'

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

// Ctrl / Command (MacOS) + S
const isSaveHotkey = isKeyHotkey('mod+s')

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

  private handleSaveWithShortcut = (e: KeyboardEvent) => {
    if(isSaveHotkey(e)){
      e.preventDefault()
      this.onClick()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleSaveWithShortcut)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleSaveWithShortcut)
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
      const glossaryContent = isGlossaryEmpty ? null : glossary
      const res = await storage.write(document, glossaryContent)
        .catch(async (e) => {
          if (e.response && e.response.status === 412) {
            const res = await confirmDialog(
              'draft-save-incorrect-version-title',
              'draft-save-incorrect-version-content',
              {
                cancel: 'draft-save-incorrect-version-button-cancel',
                overwrite: 'draft-save-incorrect-version-button-overwrite',
              },
            )
            return res
          }
          throw e
        })
      if (res) {
        if (res === 'overwrite') {
          await storage.write(document, glossaryContent, true)
        } else if (res === 'cancel') {
          this.setState({ saving: false })
          return
        } else {
          throw new Error(`Undefined response from confirmDialog: ${res}`)
        }
      }
      await documentDbContent.save(document, storage.tag)
      await documentDbGlossary.save(glossary, storage.tag)
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
