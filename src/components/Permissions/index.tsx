import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { Permission } from 'src/api/role'

type Props = {
  selected?: Permission[]
  onChange: (permissions: Permission[]) => any
}

class Permissions extends React.Component<Props> {
  state: {
    selected: Permission[]
    permissions: Permission[]
  } = {
    selected: [],
    permissions: [
      'user:invite',
      'user:delete',
      'user:edit-permissions',
      'user:assign-role',
      'book:edit',
      'module:edit',
      'role:edit',
      'editing-process:edit',
      'editing-process:manage',
    ],
  }

  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = e.target.value as Permission
    let selected = new Set(this.state.selected)
    if (selected.has(p)) {
      selected.delete(p)
    } else {
      selected.add(p)
    }
    const selectedArray = [...selected.values()]
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
    return (
      <div className="permissions">
        <ul>
          {this.state.permissions.map(p => (
            <li key={p} className="permissions__item">
              <label className="permissions__label">
                <input
                  type="checkbox"
                  className="permissions__input"
                  checked={this.state.selected.includes(p)}
                  value={p}
                  onChange={this.onInputChange}
                />
                <Localized id="permission-label" $name={p.replace(':', '-')}>
                  {p}
                </Localized>
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default Permissions
