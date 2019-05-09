import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { Process, Module } from 'src/api'
import { ProcessStructure } from 'src/api/process'
import { State } from 'src/store/reducers'

import ConfigureSlots from './ConfigureSlots'
import Button from 'src/components/ui/Button'

import './index.css'

type Props = {
  module: Module
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
    const { processes } = this.props

    return (
      <div className="begin-process">
        <h3>
          <Localized id="begin-process-select-process">
            Select process:
          </Localized>
        </h3>
        <Select
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

  private startProcess = () => {
    const { process, slots } = this.state
    if (!process) return

    const processData = {
      process: process.id,
      slots: Array.from(slots.entries()),
    }

    this.props.module.beginProcess(processData)
      .then(() => {
        store.dispatch(addAlert('success', 'begin-process-success', {
          process: process.name,
          module: this.props.module.title,
        }))
        this.props.onClose()
      })
      .catch(e => {
        store.dispatch(addAlert('error', 'begin-process-error', {details: e.response.data.error}))
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
