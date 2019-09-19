import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { SystemPermission } from 'src/api/user'

// Style for this component are the same as for TeamPermissions

export type SystemPermissionsProps = {
  selected?: SystemPermission[]
  disabled?: SystemPermission[]
  onChange: (permissions: SystemPermission[]) => void
}

export const SYSTEM_PERMISSIONS: SystemPermission[] = [
  'team:manage',
  'user:edit',
  'user:edit-permissions',
  'user:delete',
]

export type SystemPermissionsState = {
  selected: SystemPermission[]
  permissions: SystemPermission[]
}

class SystemPermissions extends React.Component<SystemPermissionsProps> {
  state: SystemPermissionsState = {
    selected: [],
    permissions: SYSTEM_PERMISSIONS
  }

  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = e.target.value as SystemPermission
    let selected = new Set(this.state.selected)
    if (selected.has(p)) {
      selected.delete(p)
    } else {
      selected.add(p)
    }
    const selectedArray = [...selected.values()] as SystemPermission[]
    this.setState({ selected: selectedArray })
    this.props.onChange(selectedArray)
  }

  componentDidUpdate(prevProps: SystemPermissionsProps) {
    if (JSON.stringify(prevProps.selected) !== JSON.stringify(this.props.selected)) {
      this.setState({ selected: this.props.selected || [] })
    }
  }

  componentDidMount() {
    this.setState({ selected: this.props.selected || [] })
  }

  public render() {
    const { permissions, selected } = this.state
    const { disabled = [] } = this.props

    return (
      <div className="permissions permissions--system">
        <ul>
          {
            permissions.map(p => {
              const isDisabled = disabled.includes(p)
              return (
                <li key={p} className={`permissions__item ${isDisabled ? 'disabled' : ''}`}>
                  <label className="permissions__label">
                    <input
                      type="checkbox"
                      className="permissions__input"
                      checked={selected.includes(p)}
                      value={p}
                      disabled={isDisabled}
                      onChange={this.onInputChange}
                    />
                    <Localized id="permission-label" $name={p.replace(':', '-')}>
                      {p}
                    </Localized>
                  </label>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default SystemPermissions
