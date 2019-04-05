import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import store from 'src/store'
import { Invitation } from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Input from 'src/components/ui/Input'

class Invitations extends React.Component {

  state: {
    emailValue: string
    isEmailVaild: boolean
  } = {
    emailValue: '',
    isEmailVaild: false,
  }

  private sendInvitation = (e: React.FormEvent) => {
    e.preventDefault()

    const { emailValue: email, isEmailVaild } = this.state

    if (!isEmailVaild) return

    Invitation.create(email)
      .then(() => {
        this.setState({ emailValue: '' })
        store.dispatch(addAlert('success', 'invitation-send-alert-success', {email: email}))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', e.message))
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

  public render() {
    const { emailValue, isEmailVaild } = this.state

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

export default Invitations
