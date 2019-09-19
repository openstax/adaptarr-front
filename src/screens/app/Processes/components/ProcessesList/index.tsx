import * as React from 'react'
import { connect } from 'react-redux'

import Process, { ProcessStructure } from 'src/api/process'

import { State } from 'src/store/reducers'

import ProcessInfo from './ProcessInfo'

import './index.css'

export type ProcessesListProps = {
  processes: Map<number, Process>
  selectedTeams: number[]
  activePreview?: number
  onProcessEdit: (process: Process) => void
  onShowPreview: (process: Process) => void
}

const mapStateToProps = ({ app: { processes, selectedTeams } }: State) => {
  return {
    processes,
    selectedTeams,
  }
}

export type ProcessesListState = {
  structure: ProcessStructure | null
}

class ProcessesList extends React.Component<ProcessesListProps> {
  state: ProcessesListState = {
    structure: null,
  }

  private editProcess = (p: Process) => {
    this.props.onProcessEdit(p)
  }

  private previewProcess = (p: Process) => {
   this.props.onShowPreview(p)
  }

  public render() {
    const { activePreview, selectedTeams } = this.props

    return (
      <ul className="processes__list">
        {
          Array.from(this.props.processes.values()).map(p => {
            if (!selectedTeams.includes(p.team)) return null
            return (
              <li key={p.id} className={`processes__item ${p.id === activePreview ? 'active' : ''}`}>
                <ProcessInfo
                  process={p}
                  onProcessEdit={this.editProcess}
                  onProcessPreview={this.previewProcess}
                />
              </li>
            )
          })
        }
      </ul>
    )
  }
}

export default connect(mapStateToProps)(ProcessesList)
