import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Role, { Permission } from 'src/api/role'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Permissions from 'src/components/Permissions'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'
import Dialog from 'src/components/ui/Dialog'

type Props = {
  role: Role
  afterAction: () => any
}

class RoleManager extends React.Component<Props> {
  
  state: {
    allowEdit: boolean
    roleName: string
    permissions: Permission[]
    showConfirmationDialog: boolean
  } = {
    allowEdit: false,
    roleName: '',
    permissions: [],
    showConfirmationDialog: false,
  }

  private toggleEditMode = () => {
    this.setState({ allowEdit: !this.state.allowEdit })
  }

  private openRemoveRoleDialog = () => {
    this.setState({ showConfirmationDialog: true })
  }

  private closeDeleteRoleDialog = () => {
    this.setState({ showConfirmationDialog: false })
  }

  private removeRole = () => {
    this.props.role.delete()
      .then(() => {
        this.props.afterAction()
        store.dispatch(addAlert('success', 'role-delete-success', {name: this.props.role.name}))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', 'role-delete-error', {details: e.response.data.error}))
      })
  }

  private onRoleNameChange = (roleName: string) => {
    this.setState({ roleName })
  }

  private handleChange = (permissions: Permission[]) => {
    this.setState({ permissions })
  }

  private updateRole = (e: React.FormEvent) => {
    e.preventDefault()
    
    const { roleName, permissions } = this.state

    let data: {name?: string, permissions?: Permission[]} = {}
    if (roleName !== this.props.role.name) {
      data.name = roleName
    }
    if (JSON.stringify(permissions) !== JSON.stringify(this.props.role.permissions)) {
      data.permissions = permissions
    }

    this.props.role.update(data)
      .then(() => {
        this.props.afterAction()
        store.dispatch(addAlert('success', 'role-update-success', {name: this.props.role.name}))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', 'role-update-error', {details: e.response.data.error}))
      })
  }

  componentDidUpdate(prevProps: Props) {
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
    const { allowEdit, roleName, permissions, showConfirmationDialog } = this.state
    const role = this.props.role

    return (
      <div className="role-manager">
        <div className="role-manager__header">
          <span className="role-manager__name">
            {
              allowEdit ?
              <Input
                l10nId="role-name"
                value={roleName}
                onChange={this.onRoleNameChange}
              />
              : role.name
            }
          </span>
          <span className="role-manager__controls">
            <Button clickHandler={this.toggleEditMode}>
              <Icon name="pencil" />
            </Button>
            <Button clickHandler={this.openRemoveRoleDialog} color="red">
              <Icon name="close" />
            </Button>
          </span>
        </div>
        <div
          className={`role-manager__content ${allowEdit ? 'active' : ''}`}
        >
          <form onSubmit={this.updateRole}>
            <Permissions
              labelsId={role.name}
              selected={permissions}
              onChange={this.handleChange}
            />
            <Localized id="role-update" attrs={{ value: true }}>
              <input type="submit" value="Update role" disabled={!roleName} />
            </Localized>
          </form>
        </div>
        {
          showConfirmationDialog ?
            <Dialog
              l10nId="role-delete-title"
              placeholder="Are you sure you want to delete this role?"
              $name={role.name}
              onClose={() => this.setState({ showConfirmationDialog: false })}
            >
              <Button 
                color="green" 
                clickHandler={this.removeRole}
              >
                <Localized id="role-delete-confirm">Confirm</Localized>
              </Button>
              <Button 
                color="red" 
                clickHandler={this.closeDeleteRoleDialog}
              >
                <Localized id="role-delete-cancel">Cancel</Localized>
              </Button>
            </Dialog>
          : null
        }
      </div>
    )
  }
}

export default RoleManager
