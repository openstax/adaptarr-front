import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { TeamPermission } from 'src/api/team'
import { SystemPermission } from 'src/api/user'

import './index.css'

type Props = {
  type: 'system' | 'team'
  selected?: SystemPermission[] | TeamPermission[]
  onChange: (permissions: SystemPermission[] | TeamPermission[]) => any
}

const SYSTEM_PERMISSIONS: SystemPermission[] = [
  'team:manage',
  'user:edit',
  'user:edit-permissions',
  'user:delete',
]

const TEAM_PERMISSIONS: TeamPermission[] = [
  'member:add', 'member:remove',
  'member:assign-role', 'member:edit-permissions',
  'role:edit', 'book:edit', 'module:edit',
  'editing-process:edit', 'editing-process:manage',
  'resources:manage',
]

class Permissions extends React.Component<Props> {
  state: {
    selected: SystemPermission[] | TeamPermission[]
    permissions: SystemPermission[] | TeamPermission[]
  } = {
    selected: [],
    permissions: this.props.type === 'system' ? SYSTEM_PERMISSIONS : TEAM_PERMISSIONS
  }

  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = e.target.value as SystemPermission | TeamPermission
    let selected = new Set(this.state.selected)
    if (selected.has(p)) {
      selected.delete(p)
    } else {
      selected.add(p)
    }
    const selectedArray = [...selected.values()] as SystemPermission[] | TeamPermission[]
    this.setState({ selected: selectedArray })
    this.props.onChange(selectedArray)
  }

  componentDidUpdate(prevProps: Props) {
    if (JSON.stringify(prevProps.selected) !== JSON.stringify(this.props.selected)) {
      this.setState({ selected: this.props.selected || [] })
    }
  }

  componentDidMount() {
    this.setState({ selected: this.props.selected || [] })
  }

  public render() {
    const { permissions, selected } = this.state

    return (
      <div className="permissions">
        <ul>
          {
            (permissions as string[]).map(p => (
              <li key={p} className="permissions__item">
                <label className="permissions__label">
                  <input
                    type="checkbox"
                    className="permissions__input"
                    checked={(selected as string[]).includes(p)}
                    value={p}
                    onChange={this.onInputChange}
                  />
                  <Localized id="permission-label" $name={p.replace(':', '-')}>
                    {p}
                  </Localized>
                </label>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default Permissions
