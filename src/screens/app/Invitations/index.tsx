import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import Role from 'src/api/role'
import Invitation, { InvitationData } from 'src/api/invitation'
import Team, { TeamPermission } from 'src/api/team'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { State } from 'src/store/reducers/'
import { TeamsMap } from 'src/store/types'

import { languages as LANGUAGES } from 'src/locale/data.json'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import TeamPermissions from 'src/components/TeamPermissions'
import Input from 'src/components/ui/Input'

import './index.css'

export type InvitationsProps = {
  teams: TeamsMap
}

const mapStateToProps = ({ app: { teams } }: State) => {
  return {
    teams,
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

  private handleTeamChange = ({ value }: { value: Team, label: string }) => {
    this.setState({ team: value })
  }

  private handleRoleChange = ({ value }: { value: Role, label: string }) => {
    this.setState({ role: value })
  }

  private handlePermissionsChange = (permissions: TeamPermission[]) => {
    this.setState({ permissions })
  }

  input: Input | null

  private setInputRef = (el: Input | null) => el && (this.input = el)

  public render() {
    const { emailValue, isEmailVaild, language, role, team, permissions } = this.state
    const { teams } = this.props

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
                  value={{ value: language, label: language.name }}
                  options={LANGUAGES.map(lan => ({ value: lan, label: lan.name }))}
                  formatOptionLabel={option => option.label}
                  onChange={this.setLanguage}
                />
                <Select
                  className="react-select"
                  value={team ? { value: team, label: team.name } : null}
                  options={Array.from(teams.values()).map(team => ({ value: team, label: team.name }))}
                  formatOptionLabel={option => option.label}
                  onChange={this.handleTeamChange}
                />
                <Select
                  className="react-select"
                  isDisabled={!team}
                  value={role ? { value: role, label: role.name } : null}
                  options={team ? team.roles.map(role => ({ value: role, label: role.name})) : []}
                  formatOptionLabel={option => option.label}
                  onChange={this.handleRoleChange}
                />
                <TeamPermissions
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

export default connect(mapStateToProps)(Invitations)
