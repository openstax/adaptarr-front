import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { TeamPermission } from 'src/api/team'

import './index.css'

interface TeamPermissionsProps {
  selected?: TeamPermission[]
  disabled?: TeamPermission[]
  onChange: (permissions: TeamPermission[]) => void
}

export const TEAM_PERMISSIONS: TeamPermission[] = [
  'member:add',
  'member:remove',
  'member:assign-role',
  'member:edit-permissions',
  'role:edit',
  'book:edit',
  'module:edit',
  'editing-process:edit',
  'editing-process:manage',
  'resources:manage',
]

class TeamPermissions extends React.Component<TeamPermissionsProps> {
  state: {
    selected: TeamPermission[]
    permissions: TeamPermission[]
  } = {
    selected: this.props.selected || [],
    permissions: TEAM_PERMISSIONS,
  }

  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = e.target.value as TeamPermission
    const selected = new Set(this.state.selected)
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
    if (!compareSelected(prevProps.selected, this.props.selected)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selected: this.props.selected || [] })
    }
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

/**
 * Return true if args are the same. Return false otherwise.
 */
const compareSelected = (
  arr1: TeamPermission[] | undefined,
  arr2: TeamPermission[] | undefined
) => {
  if (Array.isArray(arr1) && Array.isArray(arr2)) {
    if (arr1.length !== arr2.length) return false
    return arr1.every((val, i) => val === arr2[i]) && arr2.every((val, i) => val === arr1[i])
  }

  if (arr1 === arr2) return true
  return false
}
