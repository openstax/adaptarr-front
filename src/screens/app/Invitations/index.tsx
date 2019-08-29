import './index.css'

import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import store from 'src/store'
import { Invitation, Role } from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'
import { State } from 'src/store/reducers/'
import { languages as LANGUAGES } from 'src/locale/data.json'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Input from 'src/components/ui/Input'

type Props = {
  roles: Role[]
}

const mapStateToProps = ({ app: { roles } }: State) => {
  return {
    roles,
  }
}

class Invitations extends React.Component<Props> {

  state: {
    emailValue: string
    isEmailVaild: boolean
    language: typeof LANGUAGES[0]
    role: Role | null
  } = {
    emailValue: '',
    isEmailVaild: false,
    language: LANGUAGES[0],
    role: null,
  }

  private sendInvitation = (e: React.FormEvent) => {
    e.preventDefault()

    const { emailValue: email, isEmailVaild, language, role } = this.state

    if (!isEmailVaild) return

    Invitation.create({ email, role: role ? role.id : null, language: language.code })
      .then(() => {
        this.setState({ emailValue: '', role: null })
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

  private handleRoleChange = ({ value }: { value: Role, label: string }) => {
    this.setState({ role: value })
  }

  input: Input | null

  private setInputRef = (el: Input | null) => el && (this.input = el)

  public render() {
    const { emailValue, isEmailVaild, language, role } = this.state

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
                  value={role ? { value: role, label: role.name } : null}
                  options={this.props.roles.map(role => ({ value: role, label: role.name}))}
                  formatOptionLabel={option => option.label}
                  onChange={this.handleRoleChange}
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
