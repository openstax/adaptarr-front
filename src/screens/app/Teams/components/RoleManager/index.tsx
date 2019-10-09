import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Role from 'src/api/role'
import { TeamPermission } from 'src/api/team'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'

import { confirmDialog } from 'src/helpers'

import TeamPermissions from 'src/components/TeamPermissions'
import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'
import LimitedUI from 'src/components/LimitedUI'

import './index.css'

export type RoleManagerProps = {
  role: Role
  onUpdate: (role: Role) => void
  onDelete: () => void
}

export type RoleManagerState = {
  isEditing: boolean
  roleName: string
  permissions: TeamPermission[]
}

class RoleManager extends React.Component<RoleManagerProps> {
  state: RoleManagerState = {
    isEditing: false,
    roleName: '',
    permissions: [],
  }

  private toggleEditMode = () => {
    this.setState({ isEditing: !this.state.isEditing })
  }

  private openRemoveRoleDialog = async () => {
    const res = await confirmDialog({
      title: 'role-manager-delete-title',
      $name: this.props.role.name,
      buttons: {
        cancel: 'role-manager-delete-cancel',
        confirm: 'role-manager-delete-confirm',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      this.removeRole()
    }
  }

  private removeRole = () => {
    this.props.role.delete()
      .then(() => {
        this.props.onDelete()
        store.dispatch(addAlert('success', 'role-manager-delete-success', {
          name: this.props.role.name,
        }))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', 'role-manager-delete-error', {
          details: e.response.data.error,
        }))
      })
  }

  private onRoleNameChange = (roleName: string) => {
    this.setState({ roleName })
  }

  private handleChange = (permissions: TeamPermission[]) => {
    this.setState({ permissions })
  }

  private updateRole = (e: React.FormEvent) => {
    e.preventDefault()

    const { roleName, permissions } = this.state

    let data: { name?: string, permissions?: TeamPermission[] } = {}
    if (roleName !== this.props.role.name) {
      data.name = roleName
    }
    if (JSON.stringify(permissions) !== JSON.stringify(this.props.role.permissions)) {
      data.permissions = permissions
    }

    this.props.role.update(data)
      .then((r) => {
        this.props.onUpdate(r)
        store.dispatch(addAlert('success', 'role-manager-update-success', {
          name: this.props.role.name,
        }))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', 'role-manager-update-error', {
          details: e.response.data.error,
        }))
      })
  }

  private cancelEditing = () => {
    this.setState({
      isEditing: false,
      roleName: this.props.role.name,
      permissions: this.props.role.permissions,
    })
  }

  componentDidUpdate(prevProps: RoleManagerProps) {
    const prevRole = prevProps.role
    const currRole = this.props.role

    if (prevRole.name !== currRole.name) {
      this.setState({ roleName: currRole.name })
    }
    if (JSON.stringify(prevRole.permissions) !== JSON.stringify(currRole.permissions)) {
      this.setState({ permissions: currRole.permissions })
    }
  }

  componentDidMount() {
    const role = this.props.role
    this.setState({ roleName: role.name, permissions: role.permissions || [] })
  }

  public render() {
    const { isEditing, roleName, permissions } = this.state
    const role = this.props.role

    return (
      <div className="role-manager">
        <div className="role-manager__header">
          <span className="role-manager__name">
            {
              isEditing ?
                <Input
                  l10nId="role-manager-name"
                  value={roleName}
                  onChange={this.onRoleNameChange}
                />
              : role.name
            }
          </span>
          <LimitedUI team={role.team} permissions="role:edit">
            <span className="role-manager__controls">
              <Button clickHandler={this.toggleEditMode}>
                <Localized id="role-manager-edit">
                  Edit
                </Localized>
              </Button>
              <Button type="danger" clickHandler={this.openRemoveRoleDialog}>
                <Localized id="role-manager-remove">
                  Remove
                </Localized>
              </Button>
            </span>
          </LimitedUI>
        </div>
        <div
          className={`role-manager__content ${isEditing ? 'active' : ''}`}
        >
          <form onSubmit={this.updateRole}>
            <TeamPermissions
              selected={permissions}
              onChange={this.handleChange}
            />
            <Localized id="role-manager-update-confirm" attrs={{ value: true }}>
              <input type="submit" value="Update role" disabled={!roleName} />
            </Localized>
            <Button type="danger" clickHandler={this.cancelEditing}>
              <Localized id="role-manager-update-cancel">
                Cancel
              </Localized>
            </Button>
          </form>
        </div>
      </div>
    )
  }
}

export default RoleManager
