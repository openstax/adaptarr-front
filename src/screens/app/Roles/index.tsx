import './index.css'

import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import Role, { Permission } from 'src/api/role'
import store from 'src/store'
import { State } from 'src/store/reducers'
import { fetchRoles } from 'src/store/actions/app'
import { addAlert } from 'src/store/actions/Alerts'

import RoleManager from './components/RoleManager'
import Header from 'src/components/Header'
import Permissions from 'src/components/Permissions'
import Section from 'src/components/Section'
import Input from 'src/components/ui/Input'

type Props = {
  roles: Role[]
}

const mapStateToProps = ({ app: { roles } }: State) => {
  return {
    roles,
  }
}

class Roles extends React.Component<Props> {
  state: {
    roleName: string
    permissions: Permission[]
  } = {
    roleName: '',
    permissions: [],
  }

  private fetchRoles = async () => {
    store.dispatch(fetchRoles())
  }

  private addRole = (e: React.FormEvent) => {
    e.preventDefault()

    const { roleName, permissions } = this.state

    if (roleName) {
      Role.create(roleName, permissions)
        .then(() => {
          this.setState({ roleName: '', permissions: [] })
          this.fetchRoles()
          store.dispatch(addAlert('success', 'role-create-success', {name: roleName}))
        })
        .catch((e) => {
          store.dispatch(addAlert('error', 'role-create-error', {details: e.response.data.error}))
        })
    }
  }

  private onRoleNameChange = (val: string) => {
    this.setState({ roleName: val })
  }

  private handlePermissionsChange = (permissions: Permission[]) => {
    this.setState({ permissions })
  }

  public render() {
    const { roleName, permissions } = this.state
    const roles = this.props.roles

    return (
      <div className="container container--splitted">
        <Section>
          <Header l10nId="role-section-add" title="Add new role" />
          <div className="section__content roles">
            <form onSubmit={this.addRole}>
              <div className="roles__header">
                <Input
                  l10nId="role-name"
                  value={roleName}
                  onChange={this.onRoleNameChange}
                />
              </div>
              <Permissions
                selected={permissions}
                onChange={this.handlePermissionsChange}
              />
              <Localized id="role-create" attrs={{ value: true }}>
                <input type="submit" value="Create role" disabled={!roleName} />
              </Localized>
            </form>
          </div>
        </Section>
        <Section>
          <Header l10nId="role-section-manage" title="Manage roles"/>
            <div className="section__content">
              <ul className="roles__list">
                {
                  roles.map(r => {
                    return (
                      <li key={r.id}>
                        <RoleManager role={r} afterAction={this.fetchRoles} />
                      </li>
                    )
                  })
                }
              </ul>
            </div>
        </Section>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Roles)
