import * as React from 'react'
import Select from 'react-select'
import { Localized, withLocalization, GetString } from 'fluent-react/compat'
import { connect } from 'react-redux'

import Role from 'src/api/role'
import User from 'src/api/user'
import Invitation, { InvitationData } from 'src/api/invitation'
import Team, { TeamPermission } from 'src/api/team'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { State } from 'src/store/reducers/'

import { languages as LANGUAGES } from 'src/locale/data.json'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import TeamPermissions, { TEAM_PERMISSIONS } from 'src/components/TeamPermissions'
import TeamSelector from 'src/components/TeamSelector'
import Input from 'src/components/ui/Input'

import './index.css'

export type InvitationsProps = {
  user: User
  getString: GetString
}

const mapStateToProps = ({ user: { user } }: State) => {
  return {
    user,
  }
}

export type InvitationsState = {
  emailValue: string
  isEmailVaild: boolean
  language: typeof LANGUAGES[0]
  team: Team | null
  role: Role | null
  permissions: TeamPermission[]
}

class Invitations extends React.Component<InvitationsProps> {
  state: InvitationsState = {
    emailValue: '',
    isEmailVaild: false,
    language: LANGUAGES[0],
    team: null,
    role: null,
    permissions: [],
  }

  private sendInvitation = (e: React.FormEvent) => {
    e.preventDefault()

    const { emailValue: email, isEmailVaild, language, role, team, permissions } = this.state

    if (!isEmailVaild || !team) return

    let data: InvitationData = {
      email,
      language: language.code,
      team: team.id,
      permissions,
    }

    if (role) {
      data.role = role.id
    }

    Invitation.create(data)
      .then(() => {
        this.setState({
          emailValue: '',
          role: null,
          team: null,
          permissions: [],
          language: LANGUAGES[0],
        })
        this.input!.unTouch()
        store.dispatch(addAlert('success', 'invitation-send-alert-success', {email: email}))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', 'invitation-send-alert-error', {details: e.response.data.error}))
      })
  }

  private hanleInputChange = (val: string) => {
    this.setState({ emailValue: val })
    if (val.length === 0) {
      this.input!.unTouch()
    }
  }

  private handleInputValidation = (status: boolean) => {
    if (this.state.isEmailVaild !== status) {
      this.setState({ isEmailVaild: status})
    }
  }

  private setLanguage = ({ value }: { value: typeof LANGUAGES[0], label: string }) => {
    this.setState({ language: value })
  }

  private handleTeamChange = (team: Team) => {
    this.setState({ team, permissions: [] })
  }

  private handleRoleChange = (option: { value: Role, label: string } | null) => {
    this.setState({ role: option ? option.value : option })
  }

  private handlePermissionsChange = (permissions: TeamPermission[]) => {
    this.setState({ permissions })
  }

  input: Input | null

  private setInputRef = (el: Input | null) => el && (this.input = el)

  public render() {
    const { emailValue, isEmailVaild, language, role, team, permissions } = this.state
    const { user, getString } = this.props

    // User can give another user only subset of his permission in team
    let disabledPermissions: TeamPermission[] = TEAM_PERMISSIONS
    if (team) {
      if (user.isInSuperMode) {
        disabledPermissions = []
      } else {
        const usrTeam = user.teams.find(t => t.id === team.id)
        if (usrTeam && usrTeam.role && usrTeam.role.permissions) {
          disabledPermissions = TEAM_PERMISSIONS.filter(p => !usrTeam.role!.permissions!.includes(p))
        }
      }
    }

    return (
      <div className="container">
        <Section>
          <Header l10nId="invitation-view-title" title="Invite new user" />
          <div className="section__content">
            <div className="invitations">
              <form onSubmit={this.sendInvitation}>
                <Input
                  ref={this.setInputRef}
                  type="email"
                  l10nId="invitation-email"
                  value={emailValue}
                  onChange={this.hanleInputChange}
                  isValid={this.handleInputValidation}
                  validation={{email: true}}
                  errorMessage="invitation-email-validation-invalid"
                />
                <Select
                  className="react-select"
                  placeholder={getString('invitation-select-language')}
                  value={{ value: language, label: language.name }}
                  options={LANGUAGES.map(lan => ({ value: lan, label: lan.name }))}
                  formatOptionLabel={option => option.label}
                  onChange={this.setLanguage}
                />
                <TeamSelector
                  permission="member:add"
                  onChange={this.handleTeamChange}
                />
                <Select
                  className="react-select"
                  placeholder={getString('invitation-select-role')}
                  isClearable={true}
                  isDisabled={!team}
                  value={role ? { value: role, label: role.name } : null}
                  options={team ? team.roles.map(role => ({ value: role, label: role.name})) : []}
                  formatOptionLabel={option => option.label}
                  onChange={this.handleRoleChange}
                />
                <TeamPermissions
                  selected={permissions}
                  disabled={disabledPermissions}
                  onChange={this.handlePermissionsChange}
                />
                <Localized id="invitation-send" attrs={{ value: true }}>
                  <input type="submit" value="Send invitation" disabled={!isEmailVaild || !emailValue} />
                </Localized>
              </form>
            </div>
          </div>
        </Section>
      </div>
    )
  }
}

export default connect(mapStateToProps)(withLocalization(Invitations))
