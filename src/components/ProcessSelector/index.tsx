import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { Process, Team } from 'src/api'

import { State } from 'src/store/reducers'

interface ProcessSelectorProps {
  title?: string
  team?: Team | number
  isClearable?: boolean
  processes: Map<number, Process>
  onChange: (p: Process | null) => void
}

const mapStateToProps = ({ app: { processes } }: State) => ({
  processes,
})

class ProcessSelector extends React.Component<ProcessSelectorProps> {
  state: {
    process: Process | null
  } = {
    process: null,
  }

  private onChange = (res: { value: Process, label: string } | null) => {
    const process = res ? res.value : res
    this.setState({ process })
    this.props.onChange(process)
  }

  public render() {
    const { title, processes, team, isClearable = true } = this.props
    const { process } = this.state

    const options = Array.from(processes.values())
      .filter(p => {
        if (team) {
          if (typeof team === 'number') {
            if (p.team === team) return true
          } else if (p.team === team.id) {
            return true
          }
          return false
        }
        return true
      })
      .map(p => ({ value: p, label: p.name }))

    return (
      <div className="process-selector">
        <span className="process-selector__title">
          <Localized id={title ? title : 'process-selector-title'}>
            Select process:
          </Localized>
        </span>
        <Localized id="process-selector-placeholder" attrs={{ placeholder: true }}>
          <Select
            className="react-select"
            placeholder="Select..."
            value={process ? { value: process, label: process.name } : null}
            options={options}
            onChange={this.onChange}
            isClearable={isClearable}
          />
        </Localized>
      </div>
    )
  }
}

export default connect(mapStateToProps)(ProcessSelector)
