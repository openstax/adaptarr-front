import * as React from 'react'
import { match } from 'react-router'
import { Localized } from 'fluent-react/compat'
import { FilesError } from 'react-files'

import Draft from 'src/api/draft'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'

import { saveAsFile as saveAs } from 'src/helpers'

import Load from 'src/components/Load'
import Header from 'src/components/Header'
import Section from 'src/components/Section'
import Spinner from 'src/components/Spinner'
import DraftInfo from 'src/components/DraftInfo'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import FilesUploader from 'src/containers/FilesUploader'

import './index.css'

type Props = {
  draft: Draft
}

async function loader({ match: { params: { id } } }: { match: match<{ id: string }> }) {
  const draft = await Draft.load(id)
  return {
    draft,
  }
}

class DraftDetais extends React.Component<Props> {
  state: {
    isDownloading: boolean
    isImporting: boolean
    showImportDialog: boolean
    files: File[]
  } = {
    isDownloading: false,
    isImporting: false,
    showImportDialog: false,
    files: [],
  }

  private downloadCNXML = async () => {
    this.setState({ isDownloading: true })
    const data = await this.props.draft.read('index.cnxml')
    saveAs(this.props.draft.title + '.cnxml', data)
    this.setState({ isDownloading: false })
  }

  private showImportDialog = () => {
    this.setState({ showImportDialog: true })
  }

  private closeImportDialog = () => {
    this.setState({ showImportDialog: false, files: [] })
  }

  private importCNXML = async () => {
    this.setState({ isImporting: true })
    let file = this.state.files[0]
    if (!file) return
    const text = await new Response(file).text()
    this.props.draft.writeCNXML(text).then(() => {
      store.dispatch(addAlert('success', 'draft-tools-import-success'))
    }).catch(e => {
      store.dispatch(addAlert('error', 'draft-tools-import-error', { details: e.toString() }))
    })
    this.setState({ showImportDialog: false, isImporting: false })
  }

  private onFilesChange = (files: File[]) => {
    this.setState({ files, importError: '' })
  }

  private onFilesError = (error: FilesError, _: File) => {
    console.error(error)
    store.dispatch(addAlert('error', 'file-upload-error', { code: error.code }))
  }

  public render() {
    const { draft } = this.props
    const { showImportDialog, isDownloading, isImporting, files } = this.state

    return (
      <Section className="draft-details">
        <Header
          l10nId="draft-details-view-title"
          title="Draft details"
          $draft={draft.title}
        >
          <DraftInfo draft={draft} />
          <div className="draft-details__controls">
            <Button to={`/drafts/${draft.module}/edit`} withBorder={true}>
              <Localized id="draft-details-go-to-draft">
                Go to draft
              </Localized>
            </Button>
          </div>
        </Header>
        <div className="section__content">
          <Button clickHandler={this.downloadCNXML} isDisabled={isDownloading}>
            {
              isDownloading ?
                <Localized id="draft-details-button-downloading">
                  Downloading...
                </Localized>
              :
                <Localized id="draft-details-button-download">
                  Download CNXML
                </Localized>
            }
          </Button>
          <Button clickHandler={this.showImportDialog} isDisabled={isImporting}>
            {
              isImporting ?
                <Localized id="draft-details-button-importing">
                  Importing...
                </Localized>
              :
                <Localized id="draft-details-button-import">
                  Import CNXML
                </Localized>
            }
          </Button>
        </div>
        {
          showImportDialog ?
            <Dialog
              size="medium"
              l10nId="draft-details-import-title"
              placeholder="Upload CNXML file to import"
              onClose={this.closeImportDialog}
            >
              {
                isImporting ?
                  <Spinner />
                :
                  <>
                    <FilesUploader
                      onFilesChange={this.onFilesChange}
                      onFilesError={this.onFilesError}
                      accepts={['.cnxml']}
                      multiple={false}
                      optional={false}
                    />
                    <div className="dialog__buttons">
                      <Button clickHandler={this.closeImportDialog}>
                        <Localized id="draft-details-button-cancel">
                          Cancel
                        </Localized>
                      </Button>
                      <Button clickHandler={this.importCNXML} isDisabled={!files.length}>
                        <Localized id="draft-details-button-confirm">
                          Confirm
                        </Localized>
                      </Button>
                    </div>
                  </>
              }
            </Dialog>
          : null
        }
      </Section>
    )
  }
}

export default Load(loader)(DraftDetais)
