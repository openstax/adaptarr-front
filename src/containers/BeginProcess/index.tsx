import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { fetchModulesMap } from 'src/store/actions/Modules'
import { Process, Module, User } from 'src/api'
import { ProcessStructure } from 'src/api/process'
import { elevate } from 'src/api/utils'
import { State } from 'src/store/reducers'

import ConfigureSlots from './ConfigureSlots'
import Button from 'src/components/ui/Button'

import './index.css'

type Props = {
  modules: Module[]
  processes: Map<number, Process>
  onClose: () => any
}

export type SlotId = number
export type UserId = number

const mapStateToProps = ({ app: { processes } }: State) => {
  return {
    processes,
  }
}

class BeginProcess extends React.Component<Props> {
  state: {
    process: Process | null
    structure: ProcessStructure | null
    slots: Map<SlotId, UserId>
  } = {
    process: null,
    structure: null,
    slots: new Map(),
  }

  public render() {
    const { process, structure } = this.state
    const { processes, modules } = this.props

    return (
      <div className="begin-process">
        <h3>
          <Localized id="begin-process-select-process">
            Select process:
          </Localized>
        </h3>
        <Select
          className="react-select"
          value={process !== null ? {value: process, label: process.name} : null}
          options={Array.from(processes.values()).map(p => {return {value: p, label: p.name}})}
          onChange={this.handleProcessChange}
        />
        {
          structure ?
            <ConfigureSlots
              structure={structure}
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
  }

  private handleProcessChange = async ({ value: process }: { value: Process, label: string}) => {
    const structure = await process.structure()
    this.setState({ process, structure })
  }

  private handleConfigureSlotsChange = (slots: Map<SlotId, UserId>) => {
    this.setState({ slots })
  }
}

export default connect(mapStateToProps)(BeginProcess)
