import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import Process from 'src/api/process'
import { State } from 'src/store/reducers'

import ProcessInfo from './ProcessInfo'

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
  private editProcess = (p: Process) => {
    this.props.onProcessEdit(p)
  }

  public render() {
    return (
      <>
        <h2>
          <Localized id="processes-view-list">
            Current processes:
          </Localized>
        </h2>
        <ul className="list processes__list">
          {
            Array.from(this.props.processes.values()).map(p => {
              return (
                <li key={p.id} className="list__item processes__item">
                  <ProcessInfo
                    process={p}
                    onProcessEdit={this.editProcess}
                  />
                </li>
              )
            })
          }
        </ul>
      </>
    )
  }
}

export default connect(mapStateToProps)(ProcessesList)
