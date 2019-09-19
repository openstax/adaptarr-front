import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Team, { TeamPermission } from 'src/api/team'
import Role from 'src/api/role'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import TeamPermissions from 'src/components/TeamPermissions'
import Input from 'src/components/ui/Input'
import LimitedUI from 'src/components/LimitedUI'

type AddRoleProps = {
  team: Team
  onSuccess: (role: Role) => void
}

type AddRoleState = {
  roleName: string
  permissions: TeamPermission[]
}

class AddRole extends React.Component<AddRoleProps> {
  state: AddRoleState = {
    roleName: '',
    permissions: [],
  }

  private addRole = (e: React.FormEvent) => {
    e.preventDefault()

    const { roleName, permissions } = this.state

    if (roleName) {
      this.props.team.createRole({ name: roleName, permissions })
        .then((role) => {
          this.setState({ roleName: '', permissions: [] })
          this.props.onSuccess(role)
          store.dispatch(addAlert('success', 'teams-role-create-success', {
            name: roleName,
          }))
        })
        .catch((e) => {
          store.dispatch(addAlert('error', 'teams-role-create-error', {
            details: e.response.data.error,
          }))
        })
    }
  }

  private onRoleNameChange = (val: string) => {
    this.setState({ roleName: val })
  }

  private handlePermissionsChange = (permissions: TeamPermission[]) => {
    this.setState({ permissions })
  }

  public render() {
    const { roleName, permissions } = this.state

    return (
      <LimitedUI team={this.props.team} permissions="role:edit">
        <form className="teams__role-add" onSubmit={this.addRole}>
          <Input
            l10nId="teams-role-name"
            value={roleName}
            onChange={this.onRoleNameChange}
          />
          <TeamPermissions
            selected={permissions}
            onChange={this.handlePermissionsChange}
          />
          <Localized id="teams-role-create" attrs={{ value: true }}>
            <input type="submit" value="Create role" disabled={!roleName} />
          </Localized>
        </form>
      </LimitedUI>
    )
  }
}

export default AddRole
