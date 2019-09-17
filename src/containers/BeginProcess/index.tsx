import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { Process, Module, User, Team } from 'src/api'
import { ProcessStructure } from 'src/api/process'
import { elevate } from 'src/api/utils'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { fetchModulesMap } from 'src/store/actions/Modules'
import { State } from 'src/store/reducers'

import ConfigureSlots from './ConfigureSlots'
import ProcessSelector from 'src/components/ProcessSelector'
import Button from 'src/components/ui/Button'

import './index.css'

export type BeginProcessProps = {
  // All modules should belongs to one team.
  modules: Module[]
  teams: Map<number, Team>
  onClose: () => any
  afterUpdate?: (errors: Module[]) => void
}

const mapStateToProps = ({ app: { teams } }: State) => {
  return {
    teams,
  }
}

export type SlotId = number
export type UserId = number

export type BeginProcessState = {
  process: Process | null
  structure: ProcessStructure | null
  slots: Map<SlotId, UserId>
}

class BeginProcess extends React.Component<BeginProcessProps> {
  state: BeginProcessState = {
    process: null,
    structure: null,
    slots: new Map(),
  }

  public render() {
    const { process, structure } = this.state
    const { modules, teams } = this.props
    const team = process ? teams.get(process.team) : null

    return (
      <div className="begin-process">
        <ProcessSelector
          team={modules[0].team}
          onChange={this.handleProcessChange}
        />
        {
          structure && team ?
            <ConfigureSlots
              structure={structure}
              team={team}
              onChange={this.handleConfigureSlotsChange}
            />
          : null
        }
        <p>
          <strong>
            <Localized id="begin-process-info">
              You are about to start process for:
            </Localized>
          </strong>
        </p>
        <ul>
          {modules.map(m => <li key={m.id}>{m.title}</li>)}
        </ul>
        {
          process ?
            <Button clickHandler={this.startProcess}>
              <Localized id="begin-process-start">
                Start process
              </Localized>
            </Button>
          : null
        }
      </div>
    )
  }

  private startProcess = async () => {
    const { process, slots } = this.state
    if (!process) return

    const processData = {
      process: process.id,
      slots: Array.from(slots.entries()),
    }

    const session = await User.session()
    if (!session.is_elevated) {
      await elevate()
    }

    const errors: Module[] = []

    await Promise.all(this.props.modules.map(m =>
        m.beginProcess(processData)
          .catch(() => errors.push(m))))
      .then(() => {
        store.dispatch(fetchModulesMap())
        store.dispatch(addAlert('success', 'begin-process-success', {
          process: process.name,
          success: this.props.modules.length - errors.length,
          total: this.props.modules.length,
        }))
        this.props.onClose()
      })

    errors.forEach(m => {
      store.dispatch(addAlert('error', 'begin-process-error', {module: m.title}))
    })

    if (this.props.afterUpdate) {
      this.props.afterUpdate(errors)
    }
  }

  private handleProcessChange = async (process: Process) => {
    const structure = await process.structure()
    this.setState({ process, structure })
  }

  private handleConfigureSlotsChange = (slots: Map<SlotId, UserId>) => {
    this.setState({ slots })
  }
}

export default connect(mapStateToProps)(BeginProcess)
