import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { DocumentDB } from 'cnx-designer'
import { Value } from 'slate'
import { connect } from 'react-redux'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { addModuleToMap } from 'src/store/actions/Modules'
import { State } from 'src/store/reducers'
import { Draft, Storage, Module } from 'src/api'
import { Link, SlotPermission } from 'src/api/process'

import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import { SUGGESTION_TYPES } from '../../plugins/Suggestions/types'

import './index.css'

type Props = {
  draft: Draft
  onStepChange: () => any
  document: Value
  glossary: Value
  storage: Storage
  documentDbContent: DocumentDB
  documentDbGlossary: DocumentDB
  draftPermissions: SlotPermission[],
}

const mapStateToProps = ({ draft: { currentDraftPermissions } }: State) => {
  return {
    draftPermissions: currentDraftPermissions,
  }
}

class StepChanger extends React.Component<Props> {
  state: {
    link: Link | null
    confirmDialog: boolean
    unsavedChanges: boolean
    detailsDialog: boolean
    suggestionsDialog: boolean
    documentSuggestions: number
    glossarySuggestions: number
  } = {
    link: null,
    confirmDialog: false,
    unsavedChanges: false,
    detailsDialog: false,
    suggestionsDialog: false,
    documentSuggestions: 0,
    glossarySuggestions: 0,
  }

  public render() {
    const { draft: { step } } = this.props
    const { link, confirmDialog, unsavedChanges, detailsDialog, suggestionsDialog, documentSuggestions, glossarySuggestions } = this.state

    return (
      step && step.links.length > 0 && <div className="step-changer">
        <Button clickHandler={this.showDetailsDialog} withBorder={true}>
          <Localized id="step-changer-main-button">
            I'm handing my work to the next step
          </Localized>
        </Button>
        {
          detailsDialog ?
            <Dialog
              size="medium"
              l10nId="step-changer-details-dialog-title"
              placeholder="Choose next step"
              onClose={this.closeDetailsDialog}
              showCloseButton={false}
            >
              <div className="dialog__buttons">
                <Button clickHandler={this.closeDetailsDialog}>
                  <Localized id="step-changer-cancel">
                    Cancel
                  </Localized>
                </Button>
                <div className="step-changer__dialog-content">
                  {
                    step.links.map(l => {
                      return (
                        <Button
                          key={l.to}
                          clickHandler={() => this.handleStepChange(l)}
                        >
                          {l.name}
                        </Button>
                      )
                    })
                  }
                </div>
              </div>
            </Dialog>
          : null
        }
        {
          suggestionsDialog ?
            <Dialog
              size="medium"
              l10nId="step-changer-dialog-suggestions"
              placeholder="Please resolve all suggestions."
              onClose={this.closeSuggestionsDialog}
            >
              <div>
                <Localized
                  id="step-changer-dialog-suggestions-info"
                  $document={documentSuggestions}
                  $glossary={glossarySuggestions}
                >
                  You have unresolved suggestions in document or glossary. Please resolve all of them before changing step.
                </Localized>
              </div>
              <div className="step-changer__dialog-controls">
                <Button clickHandler={this.closeSuggestionsDialog}>
                  <Localized id="step-changer-dialog-suggestions-ok">
                    Ok
                  </Localized>
                </Button>
              </div>
            </Dialog>
          : null
        }
        {
          confirmDialog ?
            <Dialog
              size="medium"
              l10nId="step-changer-confirm-dialog-title"
              onClose={this.closeConfirmDialog}
              showCloseButton={false}
            >
              {
                unsavedChanges ?
                  <>
                    <p className="step-changer__info">
                      <Localized id="step-changer-unsaved-changes">
                        You have unsaved changes.
                      </Localized>
                    </p>
                    <div className="dialog__buttons">
                      <Button clickHandler={this.closeConfirmDialog}>
                        <Localized id="step-changer-cancel">
                          Cancel
                        </Localized>
                      </Button>
                      <Button clickHandler={this.nextStep}>
                        <Localized id="step-changer-discard-advance">
                          Discard changes and advance
                        </Localized>
                      </Button>
                      <Button clickHandler={this.saveAndAdvance}>
                        <Localized id="step-changer-save-advance">
                          Save and advance
                        </Localized>
                      </Button>
                    </div>
                  </>
                :
                  <div className="dialog__buttons">
                    <Button clickHandler={this.closeConfirmDialog}>
                      <Localized id="step-changer-cancel">
                        Cancel
                      </Localized>
                    </Button>
                    <Button clickHandler={this.nextStep}>
                      <Localized id="step-changer-advance">
                        Advance
                      </Localized>
                    </Button>
                  </div>
              }
            </Dialog>
          : null
        }
      </div>
    )
  }

  private showDetailsDialog = () => {
    this.setState({ detailsDialog: true })
  }

  private closeDetailsDialog = () => {
    this.setState({ detailsDialog: false })
  }

  private handleStepChange = (link: Link) => {
    this.setState({ link })
    this.showConfirmDialog()
  }

  private showConfirmDialog = async () => {
    const { storage, document, glossary, draftPermissions } = this.props

    if (draftPermissions.includes('accept-changes')) {
      const documentSuggestions = document.document.filterDescendants(n => n.object === 'inline' && SUGGESTION_TYPES.includes(n.type))
      const glossarySuggestions = glossary.document.filterDescendants(n => n.object === 'inline' && SUGGESTION_TYPES.includes(n.type))

      if (documentSuggestions.size > 0 || glossarySuggestions.size > 0) {
        this.setState({
          suggestionsDialog: true,
          documentSuggestions: documentSuggestions.size,
          glossarySuggestions: glossarySuggestions.size,
        })
        return
      }
    }

    const unsavedChanges = !storage.current(document, glossary)
    this.setState({ confirmDialog: true, detailsDialog: false, unsavedChanges })
  }

  private closeConfirmDialog = () => {
    this.setState({ confirmDialog: false })
  }

  private saveAndAdvance = async () => {
    const { storage, document, glossary, documentDbContent, documentDbGlossary } = this.props

    try {
      const isGlossaryEmpty = !this.props.glossary.document.nodes.has(0) ||
        this.props.glossary.document.nodes.get(0).type !== 'definition'
      await storage.write(document, isGlossaryEmpty ? null : glossary)
      await documentDbContent.save(document, Date.now().toString())
      await documentDbGlossary.save(glossary, Date.now().toString())
      this.nextStep()
    } catch (ex) {
      store.dispatch(addAlert('error', 'step-changer-save-advance-error', {
        details: ex.response.data.raw,
      }))
    }

  }

  private nextStep = () => {
    const link = this.state.link
    if (!link) return
    this.props.draft.advance({ target: link.to, slot: link.slot })
      .then(async (res) => {
        store.dispatch(addAlert('success', 'step-changer-success', {
          code: res.code.replace(/:/g, '-'),
        }))
        this.props.onStepChange()
        const mod = await Module.load(this.props.draft.module)
        store.dispatch(addModuleToMap(mod))
      })
      .catch(e => {
        store.dispatch(addAlert('error', 'step-changer-error', {
          details: e.response.data.raw,
        }))
      })
  }

  private closeSuggestionsDialog = () => {
    this.setState({ suggestionsDialog: false, documentSuggestions: 0, glossarySuggestions: 0 })
  }
}

export default connect(mapStateToProps)(StepChanger)
