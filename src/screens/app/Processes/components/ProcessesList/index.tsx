import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import Process, { ProcessStructure } from 'src/api/process'
import { State } from 'src/store/reducers'

import ProcessInfo from './ProcessInfo'
import ProcessPreview from 'src/containers/ProcessPreview'

import './index.css'

type Props = {
  processes: Map<number, Process>
  onProcessEdit: (process: Process) => any
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
    p.structure()
      .then(res => {
        this.setState({ structure: res })
      })
      .catch(e => {
        this.setState({ structure: null })
      })
  }

  public render() {
    return (
      <div className="processes__list">
        <div className="processes__col">
          <h2>
            <Localized id="processes-view-list">
              Current processes:
            </Localized>
          </h2>
          <ul className="list">
            {
              Array.from(this.props.processes.values()).map(p => {
                return (
                  <li key={p.id} className="list__item processes__item">
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
        </div>
        {
          this.state.structure ?
            <div className="processes__col">
              <ProcessPreview structure={this.state.structure} />
            </div>
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(ProcessesList)
