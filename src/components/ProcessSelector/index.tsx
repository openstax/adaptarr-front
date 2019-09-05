import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { Process } from 'src/api'

import { State } from 'src/store/reducers'

type Props = {
  title?: string
  processes: Map<number, Process>
  onChange: (p: Process | null) => void
}

const mapStateToProps = ({ app: { processes } }: State) => {
  return {
    processes,
  }
}

class ProcessSelector extends React.Component<Props> {
  state: {
    process: Process | null
  } = {
    process: null
  }

  private onChange = (res: { value: Process, label: string } | null) => {
    const process = res ? res.value : res
    this.setState({ process })
    this.props.onChange(process)
  }

  public render() {
    const { title, processes } = this.props
    const { process } = this.state

    return (
      <div className="process-selector">
        <span className="process-selector__title">
          <Localized id={title ? title : 'process-selector-title'}>
            Select process:
          </Localized>
        </span>
        <Localized id="process-selector-placeholder" attrs={{placeholder: true}}>
          <Select
            className="react-select"
            placeholder="Select..."
            value={process ? { value: process, label: process.name } : null}
            options={Array.from(processes.values()).map(p => {return {value: p, label: p.name}})}
            onChange={this.onChange}
            isClearable={true}
          />
        </Localized>
      </div>
    )
  }
}

export default connect(mapStateToProps)(ProcessSelector)
