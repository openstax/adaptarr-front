import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import Process, { ProcessStructure } from 'src/api/process'
import { State } from 'src/store/reducers'

import ProcessInfo from './ProcessInfo'

import './index.css'

type Props = {
  processes: Map<number, Process>
  activePreview?: number
  onProcessEdit: (process: Process) => void
  onShowPreview: (process: Process) => void
}

const mapStateToProps = ({ app: { processes } }: State) => {
  return {
    processes,
  }
}

class ProcessesList extends React.Component<Props> {
  state: {
    structure: ProcessStructure | null
  } = {
    structure: null,
  }

  private editProcess = (p: Process) => {
    this.props.onProcessEdit(p)
  }

  private previewProcess = (p: Process) => {
   this.props.onShowPreview(p)
  }

  public render() {
    const { activePreview } = this.props

    return (
      <ul className="processes__list">
        {
          Array.from(this.props.processes.values()).map(p => {
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
