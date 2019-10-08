import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { FilesError } from 'react-files'
import { PersistDB, PersistDBData } from 'cnx-designer'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'

import { saveAsFile as saveAs } from 'src/helpers'

import Header from 'src/components/Header'
import Section from 'src/components/Section'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import FileUploader from 'src/containers/FilesUploader'

import './index.css'

interface HelpdeskState {
  isExportingDatabase: boolean
  isImportingDatabase: boolean
  showImportDatabase: boolean
  files: File[]
  uploadedDatabase: PersistDBData | undefined
}

class Helpdesk extends React.Component {
  state: HelpdeskState = {
    isExportingDatabase: false,
    isImportingDatabase: false,
    showImportDatabase: false,
    files: [],
    uploadedDatabase: undefined,
  }

  private exportDatabase = async () => {
    try {
      this.setState({ isExportingDatabase: true })
      const db = await PersistDB.open()
      const data = await db.export()
      const filename = `IndexedDB-${new Date().toISOString()}.json`
      saveAs(filename, JSON.stringify(data, null, 2), 'application/json')
    } catch (e) {
      console.error(e)
      store.dispatch(addAlert('error', 'helpdesk-export-error', { details: e.toString() }))
    }
    this.setState({ isExportingDatabase: false })
  }

  private showImportDatabase = () => {
    this.setState({ showImportDatabase: true })
  }

  private closeImportDatabase = () => {
    this.setState({
      isImportingDatabase: false,
      showImportDatabase: false,
      files: [],
      uploadedDatabase: undefined,
    })
  }

  private importDatabase = async () => {
    this.setState({ isImportingDatabase: true })

    const { uploadedDatabase } = this.state
    if (!uploadedDatabase) {
      store.dispatch(addAlert('error', 'helpdesk-import-error-uploaded-database'))
      this.closeImportDatabase()
      return
    }

    try {
      const db = await PersistDB.open()
      await db.import(uploadedDatabase)
      store.dispatch(addAlert('success', 'helpdesk-import-success'))
    } catch (e) {
      console.error(e)
      store.dispatch(addAlert('error', 'helpdesk-import-error', { details: e.toString() }))
    }

    this.closeImportDatabase()
  }

  filesRef: React.RefObject<FileUploader> = React.createRef()

  public render() {
    const {
      isExportingDatabase,
      isImportingDatabase,
      showImportDatabase,
      files,
    } = this.state

    return (
      <Section>
        <Header l10nId="helpdesk-view-title" title="Helpdesk" />
        <div className="section__content helpdesk">
          <div className="helpdesk__tools">
            <Button
              clickHandler={this.exportDatabase}
              isDisabled={isExportingDatabase}
            >
              {
                isExportingDatabase ?
                  <Localized id="helpdesk-export-local-database-loading">
                    Exporting...
                  </Localized>
                  :
                  <Localized id="helpdesk-export-local-database">
                    Export local database
                  </Localized>
              }
            </Button>
            <Button clickHandler={this.showImportDatabase}>
              <Localized id="helpdesk-import-local-database">
                Import local database
              </Localized>
            </Button>
          </div>
        </div>
        {
          showImportDatabase ?
            <Dialog
              size="medium"
              l10nId="helpdesk-import-database-title"
              placeholder="Replace whole database or select drafts to replace"
              onClose={this.closeImportDatabase}
              showCloseButton={false}
            >
              {
                isImportingDatabase ?
                  <Spinner />
                  :
                  <div className="helpdesk__dialog-content">
                    <FileUploader
                      onFilesChange={this.onFilesChange}
                      onFilesError={this.onFilesError}
                      multiple={false}
                      accepts={['.json']}
                      optional={false}
                      ref={this.filesRef}
                    />
                    <div className="dialog__buttons">
                      <Button clickHandler={this.closeImportDatabase}>
                        <Localized id="helpdesk-import-cancel">
                          Cancel
                        </Localized>
                      </Button>
                      <Button
                        clickHandler={this.importDatabase}
                        isDisabled={!files.length}
                      >
                        <Localized id="helpdesk-import-confirm">
                          Import database
                        </Localized>
                      </Button>
                    </div>
                  </div>
              }
            </Dialog>
            : null
        }
      </Section>
    )
  }

  private onFilesChange = async (files: File[]) => {
    let uploadedDatabase
    if (files.length) {
      uploadedDatabase = JSON.parse(await new Response(files[0]).text())
      if (
        !uploadedDatabase.database ||
        typeof uploadedDatabase.database.name !== 'string' ||
        typeof uploadedDatabase.database.version !== 'number' ||
        !uploadedDatabase.remove ||
        !uploadedDatabase.insert
      ) {
        store.dispatch(addAlert('error', 'helpdesk-import-invalid-file'))
        this.filesRef.current!.filesRemoveOne(files[0])
        this.setState({ files: [], uploadedDatabase: undefined })
        return
      }
    }
    this.setState({ files, uploadedDatabase })
  }

  private onFilesError = (error: FilesError, _: File) => {
    store.dispatch(addAlert('error', 'file-upload-error', { code: error.code }))
  }
}

export default Helpdesk
