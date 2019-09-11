import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import { Draft, User, Role } from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { fetchUser } from 'src/store/actions/User'
import { updateUserInTeamMap } from 'src/store/actions/Team'
import { State } from 'src/store/reducers'

import decodeHtmlEntity from 'src/helpers/decodeHtmlEntity'
import confirmDialog from 'src/helpers/confirmDialog'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Load from 'src/components/Load'
import DraftsList from 'src/components/DraftsList'
import EditableText from 'src/components/EditableText'
import Button from 'src/components/ui/Button'
import Avatar from 'src/components/ui/Avatar'
import LimitedUI from 'src/components/LimitedUI'

import './index.css'

type Props = {
  user: User
  currentUser: User
  roles: Role[],
}

const mapStateToProps = ({ user: { user }, app: { roles } }: State) => {
  return {
    currentUser: user,
    roles,
  }
}

async function loader({ userId }: { userId: string }) {
  const user = await User.load(userId)

  return { user }
}

class UserProfile extends React.Component<Props> {
  state: {
    userName: string
    drafts: Draft[]
    currentRole: Role | null
  } = {
    userName: this.props.user.name,
    drafts: [],
    currentRole: this.props.user.role,
  }

  private handleNameChange = (name: string) => {
    const { user, currentUser } = this.props
    const usr = user.id === currentUser.id ? currentUser : user
    usr.changeName(name).then((res) => {
      store.dispatch(addAlert('success', 'user-profile-update-name-success'))
      store.dispatch(updateUserInTeamMap({...res.data}))
      this.setState({ userName: name })
    }).catch(() => {
      store.dispatch(addAlert('success', 'user-profile-update-name-error'))
      this.setState({ userName: this.props.user.name })
    })
  }

  private handleRoleChange = async ({ value }: { value: Role, label: string }) => {
    const res = await confirmDialog({
      title: 'user-profile-role-change',
      $role: value.name,
      buttons: {
        cancel: 'user-profile-role-button-cancel',
        confirm: 'user-profile-role-button-change',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      this.changeRole(value)
    }
  }

  private handleRoleUnassign = async () => {
    const res = await confirmDialog({
      title: 'user-profile-role-remove',
      buttons: {
        cancel: 'user-profile-role-button-cancel',
        confirm: 'user-profile-role-button-remove',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      this.changeRole(null)
    }
  }

  private changeRole = (newRole: Role | null) => {
    this.props.user.changeRole(newRole ? newRole.id : null)
      .then(() => {
        store.dispatch(fetchUser())
        if (newRole) {
          store.dispatch(addAlert('success', 'user-profile-change-role-success', {
            name: newRole.name
          }))
        } else {
          store.dispatch(addAlert('success', 'user-profile-unassign-role-success'))
        }
      })
      .catch((e) => {
        if (newRole) {
          store.dispatch(addAlert('error', 'user-profile-change-role-error', {
            details: e.response.data.error
          }))
        } else {
          store.dispatch(addAlert('error', 'user-profile-unassign-role-error', {
            details: e.response.data.error
          }))
        }
      })
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps.user.id !== this.props.user.id) {
      this.setState({ userName: this.props.user.name })
      if (this.props.currentUser.permissions.has('editing-process:manage')) {
        const usersDrafts: Draft[] = await this.props.user.drafts()
        this.setState({ drafts: usersDrafts, currentRole: this.props.user.role })
      }
    }
  }

  async componentDidMount() {
    if (this.props.currentUser.permissions.has('editing-process:manage')) {
      const usersDrafts: Draft[] = await this.props.user.drafts()
      this.setState({ drafts: usersDrafts, currentRole: this.props.user.role })
    }
  }

  public render() {
    const { drafts, currentRole, userName } = this.state
    const { user, currentUser } = this.props

    let header
    if (this.props.user.apiId === 'me') {
      header = <Header l10nId="user-profile-view-title-your" title="Your profile" />
    } else {
      header = <Header
        l10nId="user-profile-view-title-named"
        title={decodeHtmlEntity(user.name) + "'s profile"}
        $name={decodeHtmlEntity(user.name)}
        />
    }

    return (
      <Section>
        {header}
        <div className="section__content">
          <div className="profile">
            <div className="profile__top">
              <div className="profile__avatar">
                <Avatar size="big" disableLink user={user}/>
              </div>
              <div className="profile__main-info">
                <h2 className="profile__name">
                  {
                    user.id === currentUser.id || currentUser.permissions.has('user:edit') ?
                      <EditableText
                        text={userName}
                        onAccept={this.handleNameChange}
                        minLength={3}
                        maxLength={30}
                      />
                    : decodeHtmlEntity(user.name)
                  }
                </h2>
                <span className="profile__role">
                  {user.role ? user.role.name : null}
                  {
                    <LimitedUI permissions="user:assign-role">
                      <Select
                        className="react-select"
                        value={currentRole ? { value: currentRole, label: currentRole.name } : null}
                        options={this.props.roles.map(role => ({ value: role, label: role.name }))}
                        formatOptionLabel={option => option.label}
                        onChange={this.handleRoleChange}
                      />
                      <Button
                        className="profile__button--unassign-role"
                        clickHandler={this.handleRoleUnassign}
                      >
                        <Localized id="user-profile-section-role-unassign">
                          Unassign user from role
                        </Localized>
                      </Button>
                    </LimitedUI>
                    }
                </span>
              </div>
            </div>
            <div className="profile__info">
              <LimitedUI permissions="editing-process:manage">
                <h3 className="profile__title">
                  <Localized id="user-profile-users-drafts">User's drafts</Localized>
                </h3>
                <DraftsList drafts={drafts} />
              </LimitedUI>
            </div>
          </div>
        </div>
      </Section>
    )
  }
}

export default connect(mapStateToProps)(Load(loader, ['userId'])(UserProfile))
