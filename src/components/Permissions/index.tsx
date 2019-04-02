import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import { Permission } from 'src/api/role'

type Props = {
  labelsId?: string // We need custom labels id's for different Permissions component
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
      'module:assign',
      'role:edit',
    ],
  }

  private onInputChange = (p: Permission) => {
    const indexInSelected = this.state.selected.indexOf(p)
    let selected = [...this.state.selected]
    if (indexInSelected >= 0) {
      selected.splice(indexInSelected, 1)
    } else {
      selected.push(p)
    }
    this.setState({ selected })
    this.props.onChange(selected)
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
    const labelsId = this.props.labelsId || 'custom'

    return (
      <div className="permissions">
        <ul>
          {this.state.permissions.map(p => (
            <li key={p} className="permissions__item">
              <label
                htmlFor={`permission-${labelsId}-${p}`}
                className="permissions__label"
              >
                <Localized id="permission-label" $name={p}>
                  {p}
                </Localized>
                <input
                  type="checkbox"
                  className="permissions__input"
                  checked={this.state.selected.includes(p)}
                  name={`permission-${labelsId}-${p}`}
                  id={`permission-${labelsId}-${p}`}
                  value={p}
                  onChange={() => this.onInputChange(p)}
                />
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default Permissions
