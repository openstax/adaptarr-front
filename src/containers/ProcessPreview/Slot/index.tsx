import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import { ProcessSlot } from 'src/api/process'
import Role from 'src/api/role'
import { State } from 'src/store/reducers'

import './index.css'

type SlotProps = {
  roles: Role[]
  slot: ProcessSlot
}

const mapStateToProps = ({ app: { roles } }: State) => {
  return {
    roles,
  }
}

class Slot extends React.Component<SlotProps> {
  state: {
    role: string
  } = {
    role: 'undefined',
  }

  private updateStateWithProps = () => {
    const { slot, roles } = this.props
    const role = roles.find(r => r.id === slot.role)
    this.setState({ role: role ? role.name : 'undefined' })
  }

  componentDidMount() {
    this.updateStateWithProps()
  }

  public render() {
    const { role } = this.state
    const { slot } = this.props

    return (
      <div className="process-preview-slot">
        <span>
          <Localized id="process-preview-slot-name" $name={slot.name}>
            Slot name:
          </Localized>
        </span>
        <span>
          <Localized id="process-preview-slot-autofill" $value={slot.autofill.toString()}>
            Autofill:
          </Localized>
        </span>
        <span>
          <Localized id="process-preview-role" $name={role}>
            Role:
          </Localized>
        </span>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Slot)
