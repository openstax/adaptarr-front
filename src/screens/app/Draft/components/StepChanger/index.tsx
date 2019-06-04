import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { DocumentDB } from 'cnx-designer'
import { Value } from 'slate'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { addModuleToMap } from 'src/store/actions/Modules'
import { Draft, Storage, Module } from 'src/api'
import { Link } from 'src/api/process'

import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import './index.css'

type Props = {
  draft: Draft
  onStepChange: () => any
  document: Value
  glossary: Value
  storage: Storage
  documentDbContent: DocumentDB
  documentDbGlossary: DocumentDB
}

class StepChanger extends React.Component<Props> {
  state: {
    link: Link | null
    confirmDialog: boolean
    unsavedChanges: boolean
  } = {
    link: null,
    confirmDialog: false,
    unsavedChanges: false,
  }

  public render() {
    const { draft: { step } } = this.props
    const { link, confirmDialog, unsavedChanges } = this.state

    return (
      step && <div className="step-changer">
        <h3 className="step-changer__title">
          <Localized id="step-changer-choose">
            Choose link:
          </Localized>
        </h3>
        <div className="step-changer__select-link">
          <Select
            value={link !== null ? {value: link, label: link.name} : null}
            options={step.links.map(l => {return {value: l, label: l.name}})}
            onChange={this.handleStepChange}
          />
        </div>
        <div className="step-changer__controls">
          <Button
            clickHandler={this.showConfirmDialog}
            isDisabled={!link}
          >
            <Localized id="step-changer-move">
              Move using selected link
            </Localized>
          </Button>
        </div>
        {
          confirmDialog ?
            <Dialog
              size="medium"
              l10nId="step-changer-dialog-title"
              onClose={this.closeConfirmDialog}
            >
              {
                unsavedChanges ?
                  <>
                    <span className="step-changer__info">
                      <Localized id="step-changer-unsaved-changes">
                        You have unsaved changes.
                      </Localized>
                    </span>
                    <div className="step-changer__dialog-controls">
                      <Button
                        color="red"
                        clickHandler={this.closeConfirmDialog}
                      >
                        <Localized id="step-changer-cancel">
                          Cancel
                        </Localized>
                      </Button>
                      <Button
                        clickHandler={this.nextStep}
                      >
                        <Localized id="step-changer-discard-advance">
                          Discard changes and advance
                        </Localized>
                      </Button>
                      <Button
                        color="green"
                        clickHandler={this.saveAndAdvance}
                      >
                        <Localized id="step-changer-save-advance">
                          Save and advance
                        </Localized>
                      </Button>
                    </div>
                  </>
                :
                  <div className="step-changer__dialog-controls">
                    <Button
                      color="green"
                      clickHandler={this.nextStep}
                    >
                      <Localized id="step-changer-advance">
                        Advance
                      </Localized>
                    </Button>
                    <Button
                      color="red"
                      clickHandler={this.closeConfirmDialog}
                    >
                      <Localized id="step-changer-cancel">
                        Cancel
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

  private handleStepChange = ({ value: link }: {value: Link, label: string}) => {
    this.setState({ link })
  }

  private showConfirmDialog = async () => {
    const { storage, document, glossary } = this.props
    const unsavedChanges = !storage.current(document, glossary)
    this.setState({ confirmDialog: true, unsavedChanges })
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
      store.dispatch(addAlert('error', 'step-changer-save-advance-error'))
      console.error(ex)
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
          details: e.response.data.error,
        }))
      })
  }
}

export default StepChanger
