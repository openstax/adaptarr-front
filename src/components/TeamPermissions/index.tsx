import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { TeamPermission } from 'src/api/team'

import './index.css'

export type TeamPermissionsProps = {
  selected?: TeamPermission[]
  disabled?: TeamPermission[]
  onChange: (permissions: TeamPermission[]) => void
}

export const TEAM_PERMISSIONS: TeamPermission[] = [
  'member:add', 'member:remove',
  'member:assign-role', 'member:edit-permissions',
  'role:edit', 'book:edit', 'module:edit',
  'editing-process:edit', 'editing-process:manage',
  'resources:manage',
]

class TeamPermissions extends React.Component<TeamPermissionsProps> {
  state: {
    selected: TeamPermission[]
    permissions: TeamPermission[]
  } = {
    selected: [],
    permissions: TEAM_PERMISSIONS
  }

  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = e.target.value as TeamPermission
    let selected = new Set(this.state.selected)
    if (selected.has(p)) {
      selected.delete(p)
    } else {
      selected.add(p)
    }
    const selectedArray = [...selected.values()] as TeamPermission[]
    this.setState({ selected: selectedArray })
    this.props.onChange(selectedArray)
  }

  componentDidUpdate(prevProps: TeamPermissionsProps) {
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
      <div className="permissions permissions--team">
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

export default TeamPermissions
