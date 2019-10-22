import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { DocumentDB } from 'cnx-designer'
import { Block, Value } from 'slate'
import { connect } from 'react-redux'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { addModuleToMap } from 'src/store/actions/modules'
import { State } from 'src/store/reducers'

import ProcessVersion from 'src/api/processversion'
import { Draft, Module, Storage } from 'src/api'
import { Link, SlotPermission } from 'src/api/process'

import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import { SUGGESTION_TYPES } from '../../plugins/Suggestions/types'

import './index.css'

interface StepChangerProps {
  draft: Draft
  onStepChange: () => any
  document: Value
  glossary: Value
  storage: Storage
  documentDbContent: DocumentDB
  documentDbGlossary: DocumentDB
  draftPermissions: SlotPermission[]
}

const mapStateToProps = ({ draft: { currentDraftPermissions } }: State) => ({
  draftPermissions: currentDraftPermissions,
})

class StepChanger extends React.Component<StepChangerProps> {
  state: {
    link: Link | null
    confirmDialog: boolean
    unsavedChanges: boolean
    detailsDialog: boolean
    suggestionsDialog: boolean
    documentSuggestions: number
    glossarySuggestions: number
    wrongTargetDialog: boolean
    wrongTargetL10n: 'step-changer-dialog-wrong-target' |
      'step-changer-dialog-wrong-target-suggestions'
  } = {
    link: null,
    confirmDialog: false,
    unsavedChanges: false,
    detailsDialog: false,
    suggestionsDialog: false,
    documentSuggestions: 0,
    glossarySuggestions: 0,
    wrongTargetDialog: false,
    wrongTargetL10n: 'step-changer-dialog-wrong-target',
  }

  public render() {
    const { draft: { step } } = this.props
    const {
      confirmDialog,
      unsavedChanges,
      detailsDialog,
      suggestionsDialog,
      documentSuggestions,
      glossarySuggestions,
      wrongTargetDialog,
      wrongTargetL10n,
    } = this.state

    return (
      step && step.links.length > 0 && <div className="step-changer">
        <Button clickHandler={this.showDetailsDialog} withBorder={true}>
          <Localized id="step-changer-main-button">
            I am handing my work to the next step
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
                      const onClick = () => {
                        this.handleStepChange(l)
                      }
                      return (
                        <Button
                          key={l.to}
                          clickHandler={onClick}
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
                  You have unresolved suggestions in document or glossary.
                  Please resolve all of them before changing step.
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
          wrongTargetDialog ?
            <Dialog
              size="medium"
              l10nId="step-changer-dialog-wrong-target-title"
              placeholder="Wrong target"
              onClose={this.closeWrongTargetDialog}
            >
              <div>
                <Localized
                  id={wrongTargetL10n}
                  $document={documentSuggestions}
                  $glossary={glossarySuggestions}
                  $total={documentSuggestions + glossarySuggestions}
                >
                  We could not find target which you selected.
                  Please try again later or contact administrator.
                </Localized>
              </div>
              <div className="step-changer__dialog-controls">
                <Button clickHandler={this.closeWrongTargetDialog}>
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
    const { storage, document, glossary, draftPermissions, draft } = this.props

    if (draftPermissions.some(p => ['accept-changes', 'propose-changes'].includes(p))) {
      const documentSuggestions = document.document.filterDescendants(
        n => n.object === 'inline' && SUGGESTION_TYPES.includes(n.type)
      )
      const glossarySuggestions = glossary.document.filterDescendants(
        n => n.object === 'inline' && SUGGESTION_TYPES.includes(n.type)
      )

      // User with accept-changes permission have to accept / decline all of the suggestions.
      if (draftPermissions.includes('accept-changes')) {
        if (documentSuggestions.size > 0 || glossarySuggestions.size > 0) {
          this.setState({
            suggestionsDialog: true,
            documentSuggestions: documentSuggestions.size,
            glossarySuggestions: glossarySuggestions.size,
          })
          return
        }
      }

      // User with propose-changes cannot move draft to step other than accept-changes
      // if there are unresolved suggestions.
      if (draftPermissions.includes('propose-changes')) {
        let targetStep
        try {
          const [processId, versionId] = draft.step!.process
          const process = await ProcessVersion.load(processId, versionId)
          if (!process) {
            throw new Error(
              `Couldn't find process version: id: ${processId}, version: ${versionId}`
            )
          }
          targetStep = await process.step(this.state.link!.to)
          if (!targetStep) throw new Error(`Couldn't find step: ${this.state.link!.to}`)
        } catch (e) {
          this.setState({
            wrongTargetDialog: true,
            wrongTargetL10n: 'step-changer-dialog-wrong-target',
          })
          return
        }

        const isLinkingToAcceptChanges = targetStep.slots.some(
          sl => sl.permissions.includes('accept-changes')
        )
        if (!isLinkingToAcceptChanges) {
          if (documentSuggestions.size > 0 || glossarySuggestions.size > 0) {
            this.setState({
              wrongTargetDialog: true,
              wrongTargetL10n: 'step-changer-dialog-wrong-target-suggestions',
              documentSuggestions: documentSuggestions.size,
              glossarySuggestions: glossarySuggestions.size,
            })
            return
          }
        }
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
      const isGlossaryEmpty = !glossary.document.nodes.has(0) ||
        (glossary.document.nodes.get(0) as Block).type !== 'definition'
      await storage.write(document, isGlossaryEmpty ? null : glossary)
      await documentDbContent.save(document, storage.tag)
      await documentDbGlossary.save(glossary, storage.tag)
      this.nextStep()
    } catch (ex) {
      store.dispatch(addAlert('error', 'step-changer-save-advance-error', {
        details: ex.response ? ex.response.data.raw : ex.toString(),
      }))
    }
  }

  private nextStep = () => {
    const link = this.state.link
    if (!link) return
    this.props.draft.advance({ target: link.to, slot: link.slot })
      .then(async res => {
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
    this.setState({
      suggestionsDialog: false,
      documentSuggestions: 0,
      glossarySuggestions: 0,
    })
  }

  private closeWrongTargetDialog = () => {
    this.setState({
      wrongTargetDialog: false,
      wrongTargetL10n: 'step-changer-dialog-wrong-target',
      documentSuggestions: 0,
      glossarySuggestions: 0,
    })
  }
}

export default connect(mapStateToProps)(StepChanger)
