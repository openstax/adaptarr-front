import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { FilesError } from 'react-files'
import { PersistDB, PersistDBData } from 'cnx-designer'
import { connect } from 'react-redux'

import Conversation, { ConversationData } from 'src/api/conversation'

import store from 'src/store'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/Alerts'
import { createConversation, openConversation } from 'src/store/actions/Conversations'

import saveAs from 'src/helpers/saveAsFile'

import Header from 'src/components/Header'
import Section from 'src/components/Section'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import FileUploader from 'src/containers/FilesUploader'
import Chat from 'src/containers/Chat'

import './index.css'

type Props = {
  conversations: Map<number, ConversationData>
  sockets: Map<number, Conversation>
}

const mapStateToProps = ({ conversations: { conversations, sockets } }: State) => {
  return {
    conversations,
    sockets,
  }
}

class Helpdesk extends React.Component<Props> {
  state: {
    isExportingDatabase: boolean
    isImportingDatabase: boolean
    showImportDatabase: boolean
    files: File[]
    uploadedDatabase: PersistDBData | undefined
    showWhatToReplace: boolean
    selectedStates: string[]
    conversation: Conversation | undefined
  } = {
    isExportingDatabase: false,
    isImportingDatabase: false,
    showImportDatabase: false,
    files: [],
    uploadedDatabase: undefined,
    showWhatToReplace: false,
    selectedStates: [],
    conversation: undefined,
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
      showWhatToReplace:false,
      files: [],
      uploadedDatabase: undefined,
      selectedStates: [],
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

  // TODO: Move import / export tools to another component

  private startHelpdeskConversation = () => {
    // TODO: This should check for helpdesk conversation instead of 123
    if (this.props.conversations.has(2)) {
      if (this.props.sockets.has(2)) {
        const conversation = this.props.sockets.get(2)!
        this.setState({ conversation })
      } else {
        store.dispatch(openConversation(2))
      }
    } else {
      // This should create helpdesk conversation instead of hardocded one
      store.dispatch(createConversation([1, 2]))
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.conversations.size !== this.props.conversations.size
      || prevProps.sockets.size !== this.props.sockets.size
      ) {
        this.startHelpdeskConversation()
      }
  }

  componentDidMount () {
    this.startHelpdeskConversation()
  }

  public render() {
    const {
      isExportingDatabase,
      isImportingDatabase,
      showImportDatabase,
      files,
      conversation,
    } = this.state

    return (
      <div className="container container--splitted helpdesk">
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
        <Section>
          <Header l10nId="helpdesk-view-chat-title" title="Chat" />
          {
            conversation ?
              <Chat conversation={conversation} />
            : <Spinner/>
          }
        </Section>
      </div>
    )
  }

  private onFilesChange = async (files: File[]) => {
    let uploadedDatabase = undefined
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

export default connect(mapStateToProps)(Helpdesk)
