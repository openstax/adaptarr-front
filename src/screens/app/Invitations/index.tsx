import './index.css'

import * as React from 'react'
import { Trans } from 'react-i18next'

import i18n from 'src/i18n'
import axios from 'src/config/axios'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import SuperSession from 'src/components/SuperSession'
import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'

class Invitations extends React.Component {

  state: {
    showSuperSession: boolean
    emailValue: string
    isEmailVaild: boolean
  } = {
    showSuperSession: false,
    emailValue: '',
    isEmailVaild: false,
  }

  private sendInvitation = () => {
    const { emailValue: email, isEmailVaild } = this.state

    if (!isEmailVaild) return

    axios.post('users/invite', {email})
      .then(() => {
        this.setState({ emailValue: '' })
        store.dispatch(addAlert('success', i18n.t("Invitations.sentTo", {email: email})))
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', i18n.t("Admin.confirmSuperSession")))
        } else {
          store.dispatch(addAlert('error', e.message))
        }
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

  private superSessionSuccess = () => {
    this.sendInvitation()
    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    store.dispatch(addAlert('error', e.message))
  }

  private closeSuperSession = () => {
    this.setState({ showSuperSession: false })
  }

  public render() {
    const { showSuperSession, emailValue } = this.state

    return (
      <div className="container">
        {
          showSuperSession ?
            <SuperSession 
              onSuccess={this.superSessionSuccess} 
              onFailure={this.superSessionFailure}
              onAbort={this.closeSuperSession}
            />
          : null
        }
        <Section>
          <Header i18nKey="Invitations.title"/>
          <div className="section__content">
            <div className="invitatio">
              <Input
                type="email"
                value={emailValue}
                onChange={this.hanleInputChange}
                isValid={this.handleInputValidation}
                placeholder={i18n.t("Invitations.emailPlaceholder")}
                validation={{email: true}}
                errorMessage={i18n.t("Invitations.emailInvalid")}
              />
              <br/>
              <Button color="green" size="medium" clickHandler={this.sendInvitation}>
                <Trans i18nKey="Buttons.invite"/>
              </Button>
            </div>
          </div>
        </Section>
      </div>
    )
  }
}

export default Invitations
