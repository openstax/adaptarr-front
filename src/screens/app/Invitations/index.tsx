import './index.css'

import * as React from 'react'
import { Trans } from 'react-i18next'

import i18n from 'src/i18n'
import store from 'src/store'
import { Invitation } from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'

class Invitations extends React.Component {

  state: {
    emailValue: string
    isEmailVaild: boolean
  } = {
    emailValue: '',
    isEmailVaild: false,
  }

  private sendInvitation = () => {
    const { emailValue: email, isEmailVaild } = this.state

    if (!isEmailVaild) return

    Invitation.create(email)
      .then(() => {
        this.setState({ emailValue: '' })
        store.dispatch(addAlert('success', i18n.t("Invitations.sentTo", {email: email})))
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
    const { emailValue } = this.state

    return (
      <div className="container">
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
