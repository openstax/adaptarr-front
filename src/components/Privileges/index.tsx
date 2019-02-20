import './index.css'

import * as React from 'react'

import i18n from 'src/i18n'

// TODO: Add documentation for all Privileges
type Privilege = { flag: number, status: boolean }

type Props = {
  onChange: (flags: number[]) => any
  privileges?: number[]
}

class Privileges extends React.Component<Props> {
  state: {
    privileges: Privilege[]
  } = {
    privileges: [
      { flag: 1, status: false },
      { flag: 2, status: false },
      { flag: 3, status: false },
      { flag: 4, status: false },
      { flag: 5, status: false },
      { flag: 6, status: false },
      { flag: 7, status: false },
    ]
  }

  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let flags: number[] = []
    const flag = +e.target.value
    const status = e.target.checked

    const newPrivileges = this.state.privileges.map(p => {
      if (p.flag === flag) {
        if (status) {
          flags.push(p.flag)
        }
        return { flag: p.flag, status }
      } else {
        if (p.status) {
          flags.push(p.flag)
        }
        return p
      }
    })
    this.setState({ privileges: newPrivileges }, this.props.onChange(flags))
  }

  // Reset state of privilages to match only provided flags
  private updatePrivileges = (flags: number[]) => {
    const newPrivileges = this.state.privileges.map(p => {
      if (flags.includes(p.flag)) {
        return { flag: p.flag, status: true }
      } else {
        return { flag: p.flag, status: false}
      }
    })
    this.setState({ privileges: newPrivileges }, this.props.onChange(flags))
  }

  componentDidUpdate = (prevProps: Props) => {
    if (!this.props.privileges) return

    if (JSON.stringify(prevProps.privileges) !== JSON.stringify(this.props.privileges)) {
      this.updatePrivileges(this.props.privileges)
    }
  }

  componentDidMount = () => {
    if (this.props.privileges) {
      this.updatePrivileges(this.props.privileges)
    }
  }

  public render() {
    return (
      <div className="privileges">
        <ul>
          {this.state.privileges.map(p => (
            <li key={p.flag} className="privileges__item">
              <label
                htmlFor={'flag-' + p.flag}
                className="privileges__label"
              >
                {i18n.t(`Privileges.flag.${p.flag}`)}
              </label>
              <input
                type="checkbox"
                className="privileges__input"
                checked={p.status}
                name={'flag-' + p.flag}
                id={'flag-' + p.flag}
                value={p.flag}
                onChange={this.onInputChange}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default Privileges
