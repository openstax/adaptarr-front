import * as React from 'react'
import Select from 'react-select'
import { GetString, Localized, withLocalization } from 'fluent-react/compat'
import { connect } from 'react-redux'

import Role from 'src/api/role'
import User from 'src/api/user'
import Invitation, { InvitationData } from 'src/api/invitation'
import Team, { TeamPermission } from 'src/api/team'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { State } from 'src/store/reducers/'

import { useIsInSuperMode } from 'src/hooks'

import { languages as LANGUAGES } from 'src/locale/data.json'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import TeamPermissions, { TEAM_PERMISSIONS } from 'src/components/TeamPermissions'
import TeamSelector from 'src/components/TeamSelector'
import Input from 'src/components/ui/Input'

import './index.css'

interface InvitationsProps {
  user: User
  getString: GetString
}

const mapStateToProps = ({ user: { user } }: State) => ({
  user,
})

const Invitations = (props: InvitationsProps) => {
  const [email, setEmail] = React.useState('')
  const [isEmailVaild, setIsEmailVaild] = React.useState(false)
  const [language, setLanguage] = React.useState<typeof LANGUAGES[0]>(LANGUAGES[0])
  const [team, setTeam] = React.useState<Team | null>(null)
  const [role, setRole] = React.useState<Role | null>(null)
  const [permissions, setPermissions] = React.useState<TeamPermission[]>([])
  const isInSuperMode = useIsInSuperMode(props.user)

  const sendInvitation = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isEmailVaild || !team) return

    const data: InvitationData = {
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
        setEmail('')
        setRole(null)
        setTeam(null)
        setPermissions([])
        setLanguage(LANGUAGES[0])
        inputRef!.current!.unTouch()
        store.dispatch(addAlert('success', 'invitation-send-alert-success', { email }))
      })
      .catch(e => {
        store.dispatch(addAlert('error', 'invitation-send-alert-error', {
          details: e.response.data.error,
        }))
      })
  }

  const hanleInputChange = (val: string) => {
    setEmail(val)
    if (val.length === 0) {
      inputRef!.current!.unTouch()
    }
  }

  const handleInputValidation = (status: boolean) => {
    if (isEmailVaild !== status) {
      setIsEmailVaild(status)
    }
  }

  const handleLanguageChange = ({ value }: { value: typeof LANGUAGES[0], label: string }) => {
    setLanguage(value)
  }

  const handleTeamChange = (team: Team) => {
    setTeam(team)
    setPermissions([])
  }

  const handleRoleChange = (option: { value: Role, label: string } | null) => {
    setRole(option ? option.value : option)
  }

  const handlePermissionsChange = (permissions: TeamPermission[]) => {
    setPermissions(permissions)
  }

  const inputRef = React.useRef<Input>(null)

  const { user, getString } = props

  // User can give another user only subset of his permission in team
  let disabledPermissions: TeamPermission[] = TEAM_PERMISSIONS
  if (team) {
    if (isInSuperMode) {
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
            <form onSubmit={sendInvitation}>
              <Input
                ref={inputRef}
                type="email"
                l10nId="invitation-email"
                value={email}
                onChange={hanleInputChange}
                isValid={handleInputValidation}
                validation={{ email: true }}
                errorMessage="invitation-email-validation-invalid"
              />
              <Select
                className="react-select"
                placeholder={getString('invitation-select-language')}
                value={{ value: language, label: language.name }}
                options={LANGUAGES.map(lan => ({ value: lan, label: lan.name }))}
                formatOptionLabel={formatOptionLabel}
                onChange={handleLanguageChange}
              />
              <TeamSelector
                permission="member:add"
                onChange={handleTeamChange}
              />
              <Select
                className="react-select"
                placeholder={getString('invitation-select-role')}
                isClearable={true}
                isDisabled={!team}
                value={role ? { value: role, label: role.name } : null}
                options={team ? team.roles.map(role => ({ value: role, label: role.name })) : []}
                formatOptionLabel={formatOptionLabel}
                onChange={handleRoleChange}
              />
              <TeamPermissions
                selected={permissions}
                disabled={disabledPermissions}
                onChange={handlePermissionsChange}
              />
              <Localized id="invitation-send" attrs={{ value: true }}>
                <input type="submit" value="Send invitation" disabled={!isEmailVaild || !email} />
              </Localized>
            </form>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default connect(mapStateToProps)(withLocalization(Invitations))

const formatOptionLabel = (option: { label: string, value: any }) => option.label
