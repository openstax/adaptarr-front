import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Role from 'src/api/role'
import { ProcessSlot } from 'src/api/process'

import './index.css'

interface SlotProps {
  roles: Role[]
  slot: ProcessSlot
}

class Slot extends React.Component<SlotProps> {
  state: {
    rolesNames: string[]
  } = {
    rolesNames: [],
  }

  private updateStateWithProps = () => {
    const { slot, roles } = this.props
    const rolesNames: string[] = []
    roles.forEach(r => {
      if (slot.roles.includes(r.id)) {
        rolesNames.push(r.name)
      }
    })
    this.setState({ rolesNames })
  }

  componentDidMount() {
    this.updateStateWithProps()
  }

  public render() {
    const { rolesNames } = this.state
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
            Automatic assignment of users
          </Localized>
        </span>
        <span>
          <Localized id="process-preview-roles" $roles={rolesNames.join(', ')}>
            {`Roles: ${rolesNames}`}
          </Localized>
        </span>
      </div>
    )
  }
}

export default Slot
