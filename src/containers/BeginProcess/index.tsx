import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { fetchModulesMap } from 'src/store/actions/Modules'
import { Process, Module, User } from 'src/api'
import { ProcessStructure } from 'src/api/process'
import { elevate } from 'src/api/utils'

import ConfigureSlots from './ConfigureSlots'
import ProcessSelector from 'src/components/ProcessSelector'
import Button from 'src/components/ui/Button'

import './index.css'

type Props = {
  modules: Module[]
  onClose: () => any
  afterUpdate?: (errors: Module[]) => void
}

export type SlotId = number
export type UserId = number

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
    const { modules } = this.props

    return (
      <div className="begin-process">
        <ProcessSelector
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

export default BeginProcess
