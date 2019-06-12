import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import { Process, Draft } from 'src/api'
import { State } from 'src/store/reducers'

import './index.css'

type Props = {
  draft: Draft
  processes: Map<number, Process>
  showProcess?: boolean
  showStep?: boolean
  showPermissions?: boolean
}

const mapStateToProps = ({ app: { processes } }: State) => {
  return {
    processes,
  }
}

class DraftInfo extends React.Component<Props> {

  public render() {
    const { draft, processes, showProcess = true, showStep = true, showPermissions = true } = this.props

    if (!draft.permissions || !draft.step) return null

    const processId = draft.step.process[0]
    const process = processes.has(processId) ? processes.get(processId)!.name : 'undefined'

    return (
      <div className="draft-info">
        {
          showProcess && <span className="draft-info__process">
            <Localized
              id="draft-info-process"
              $process={process}
            >
              {'Process: { $process }'}
            </Localized>
          </span>
        }
        {
          showStep && <span className="draft-info__step">
            <Localized
              id="draft-info-step"
              $step={draft.step.name}
            >
              {'Current step: { $step }'}
            </Localized>
          </span>
        }
        {
          showPermissions && <span className="draft-info__permissions">
            <Localized id="draft-info-permissions">
              Your permissions:
            </Localized>
            {
              draft.permissions.map(p => {
                return (
                  <span className="draft-info__permission">
                    <Localized
                      id="draft-info-permission"
                      $permission={p}
                    >
                      {p}
                    </Localized>
                  </span>
                )
              })
            }
          </span>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(DraftInfo)
