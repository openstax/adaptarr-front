import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import User from 'src/api/user'
import Team, { TeamID } from 'src/api/team'
import Process, { ProcessStructure } from 'src/api/process'
import { elevate } from 'src/api/utils'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { fetchProcesses } from 'src/store/actions/app'
import { State } from 'src/store/reducers'
import { TeamsMap } from 'src/store/types'

import { confirmDialog } from 'src/helpers'

import ProcessForm from './components/ProcessForm'
import ProcessesList from './components/ProcessesList'
import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import ProcessPreview from 'src/containers/ProcessPreview'

import './index.css'

interface ProcessesProps {
  teams: TeamsMap
}

const mapStateToProps = ({ app: { teams } }: State) => ({
  teams,
})

interface ProcessesState {
  showForm: boolean
  structure: ProcessStructure | null
  process: Process | null
  team: Team | null
  showPreview: boolean
  previewStructure: ProcessStructure | null
}

class Processes extends React.Component<ProcessesProps> {
  state: ProcessesState = {
    showForm: false,
    structure: null,
    process: null,
    team: null,
    showPreview: false,
    previewStructure: null,
  }

  private showForm = () => {
    this.setState({ showForm: true, showPreview: false, structure: null, process: null })
  }

  private closeForm = () => {
    this.setState({ showForm: false, structure: null, process: null })
  }

  private onProcessEdit = async (p: Process) => {
    const structure = await p.structure()
    this.setState({ showForm: true, structure, process: p })
  }

  private createProcess = async (structure: ProcessStructure, team: TeamID) => {
    // Create new process if we are not editing existing one.
    if (!this.state.process) {
      Process.create(structure, team)
        .then(() => {
          this.closeForm()
          store.dispatch(addAlert('success', 'process-create-success', { name: structure.name }))
          store.dispatch(fetchProcesses())
        })
        .catch(e => {
          store.dispatch(
            addAlert(
              'error',
              'process-create-error',
              { details: e.response.data.raw }
            )
          )
        })
    } else {
      // Check if changes require creating new version.
      // If not then just update changed fields.
      const oldStructure = await this.state.process.structure()

      const {
        newVersionRequired,
        updates,
      } = this.compareOldWithNew(oldStructure, structure)

      if (!newVersionRequired) {
        try {
          const session = await User.session()
          if (!session.is_elevated) {
            await elevate()
          }
          await Promise.all(updates.map(u => u()))
          this.closeForm()
          store.dispatch(addAlert('success', 'process-update-success'))
          store.dispatch(fetchProcesses())
        } catch (e) {
          console.error(e)
          store.dispatch(addAlert('error', 'process-update-error'))
        }
      } else {
        // Show confirmation dialog
        this.showConfirmNewVersionCreation(structure)
      }
    }
  }

  private showConfirmNewVersionCreation = async (structure: ProcessStructure) => {
    const res = await confirmDialog({
      title: 'process-update-warning-new-version',
      content: <Localized id="process-update-warning-new-version-content" p={<p/>}>
        <div className="process__dialog-content" />
      </Localized>,
      buttons: {
        cancel: 'process-update-warning-new-version-cancel',
        confirm: 'process-update-warning-new-version-confirm',
      },
    })

    if (res === 'confirm') {
      this.createNewProcessVersion(structure)
    }
  }

  private createNewProcessVersion = (structure: ProcessStructure) => {
    const { process } = this.state
    if (!process) return

    process.createVersion(structure)
      .then(() => {
        this.closeForm()
        store.dispatch(
          addAlert(
            'success',
            'process-create-version-success',
            { name: structure.name }
          )
        )
        store.dispatch(fetchProcesses())
      })
      .catch(e => {
        store.dispatch(
          addAlert(
            'error',
            'process-create-version-error',
            { details: e.response.data.raw }
          )
        )
      })
  }

  private closePreview = () => {
    this.setState({ showPreview: false, previewStructure: null, team: null })
  }

  private onShowPreview = async (p: Process) => {
    const previewStructure = await p.structure()
    const team = this.props.teams.get(p.team)
    if (!team) {
      console.error(`Couldn't find team with id: ${p.team}`)
      return
    }
    this.setState({ showPreview: true, previewStructure, team })
  }

  private compareOldWithNew = (oldStructure: ProcessStructure, newStructure: ProcessStructure): {
    newVersionRequired: boolean,
    updates: Function[],
  } => {
    const { process } = this.state

    if (!process) {
      throw new Error("Couldn't establish process to update.")
    }

    const res: {
      newVersionRequired: boolean
      updates: any[]
    } = {
      newVersionRequired: false,
      updates: [],
    }

    if (
      oldStructure.slots.length !== newStructure.slots.length
      || oldStructure.steps.length !== newStructure.steps.length
      || oldStructure.start !== newStructure.start
    ) {
      return {
        newVersionRequired: true,
        updates: [],
      }
    }

    if (oldStructure.name !== newStructure.name) {
      res.updates.push(() => process.updateName(newStructure.name))
    }

    // Slots and steps have unique id's, but those are present only on oldStructure,
    // so we are comparing slots, steps, links by index and we are using id from oldStructre
    // to update them. We have to check all fields, because only few of them are editable.

    let slotIndex = 0
    for (const slot of oldStructure.slots) {
      const newSlot = newStructure.slots[slotIndex]
      if (slot.autofill !== newSlot.autofill) {
        return {
          newVersionRequired: true,
          updates: [],
        }
      }
      const slotUpdate: {name?: string, roles?: number[]} = {}
      if (slot.name !== newSlot.name) {
        slotUpdate.name = newSlot.name
      }
      if (numberArrayDiff(slot.roles, newSlot.roles).length) {
        slotUpdate.roles = newSlot.roles
      }
      if (slotUpdate.name || slotUpdate.roles) {
        res.updates.push(() => process.updateSlot(slot.id, slotUpdate))
      }

      slotIndex++
    }

    let stepIndex = 0
    for (const step of oldStructure.steps) {
      const newStep = newStructure.steps[stepIndex]
      if (
        step.links.length !== newStep.links.length
        || step.slots.length !== newStep.slots.length
      ) {
        return {
          newVersionRequired: true,
          updates: [],
        }
      }

      if (step.name !== newStep.name) {
        res.updates.push(() => process.updateStepName(step.id, newStep.name))
      }

      let linkIndex = 0
      for (const link of step.links) {
        const newLink = newStep.links[linkIndex]
        // link.slot/to are based on indexes so we can easly compare them
        if (
          link.slot !== newLink.slot
          || link.to !== newLink.to
        ) {
          return {
            newVersionRequired: true,
            updates: [],
          }
        }

        if (link.name !== newLink.name) {
          const slotId = oldStructure.slots[link.slot].id
          const stepId = oldStructure.steps[link.to].id
          res.updates.push(() => process.updateLinkName(step.id, slotId, stepId, newLink.name))
        }

        linkIndex++
      }

      let slotIndex = 0
      for (const slot of step.slots) {
        const newSlot = step.slots[slotIndex]
        // slot.slot are based on indexes so we can easly compare them
        if (
          slot.slot !== newSlot.slot
          || slot.permission !== newSlot.permission
        ) {
          return {
            newVersionRequired: true,
            updates: [],
          }
        }

        slotIndex++
      }

      stepIndex++
    }

    return res
  }

  public render() {
    const { showForm, structure, showPreview, previewStructure, process, team } = this.state

    return (
      <div className={`container ${showPreview ? 'container--splitted' : ''}`}>
        <Section>
          <Header l10nId="processes-view-title" title="Manage processes" />
          <div className="section__content processes">
            {
              showForm ?
                <ProcessForm
                  structure={structure}
                  process={process ? process : undefined}
                  onSubmit={this.createProcess}
                  onCancel={this.closeForm}
                />
                :
                <>
                  <div className="processes__create-new">
                    <Button clickHandler={this.showForm}>
                      <Localized id="processes-view-add">
                        Add new process
                      </Localized>
                    </Button>
                  </div>
                  <ProcessesList
                    onProcessEdit={this.onProcessEdit}
                    onShowPreview={this.onShowPreview}
                    activePreview={process ? process.id : undefined}
                  />
                </>
            }
          </div>
        </Section>
        {
          showPreview && previewStructure && team ?
            <Section>
              <Header
                l10nId="processes-view-preview"
                title="Process preview"
              >
                <Button clickHandler={this.closePreview} className="close-button">
                  <Icon name="close" />
                </Button>
              </Header>
              <div className="section__content">
                <ProcessPreview
                  structure={previewStructure}
                  team={team}
                />
              </div>
            </Section>
            : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(Processes)

function numberArrayDiff(a: number[], b: number[]) {
  if (a.length > b.length) {
    return a.filter(item => b.indexOf(item) < 0)
  }
  return b.filter(item => a.indexOf(item) < 0)
}
