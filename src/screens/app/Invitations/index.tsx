import './index.css'

import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import { Invitation } from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'
import { languages as LANGUAGES } from 'src/locale/data.json'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Input from 'src/components/ui/Input'

class Invitations extends React.Component {

  state: {
    emailValue: string
    isEmailVaild: boolean
    langCode: string
  } = {
    emailValue: '',
    isEmailVaild: false,
    langCode: LANGUAGES[0].code,
  }

  private sendInvitation = (e: React.FormEvent) => {
    e.preventDefault()

    const { emailValue: email, isEmailVaild, langCode } = this.state

    if (!isEmailVaild) return

    Invitation.create(email, langCode)
      .then(() => {
        this.setState({ emailValue: '' })
        store.dispatch(addAlert('success', 'invitation-send-alert-success', {email: email}))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', 'invitation-send-alert-error', {details: e.response.data.error}))
      })
  }

  private hanleInputChange = (val: string) => {
    this.setState({ emailValue: val })
  }

  private handleInputValidation = (status: boolean) => {
    if (this.state.isEmailVaild !== status) {
      this.setState({ isEmailVaild: status})
    }
  }

  private setLanguage = ({ code }: typeof LANGUAGES[0]) => {
    this.setState({ langCode: code })
  }

  public render() {
    const { emailValue, isEmailVaild, langCode } = this.state
    const language = LANGUAGES.find(lang => lang.code === langCode)

    return (
      <div className="container">
        <Section>
          <Header l10nId="invitation-view-title" title="Invite new user" />
          <div className="section__content">
            <div className="invitations">
              <form onSubmit={this.sendInvitation}>
                <Input
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
                  value={language}
                  onChange={this.setLanguage}
                  options={LANGUAGES}
                  getOptionLabel={getOptionLabel}
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

function getOptionLabel({ name }: typeof LANGUAGES[0]) {
  return name
}

export default Invitations
