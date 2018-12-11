import * as React from 'react'
import { Trans } from 'react-i18next'

import axios from '../../../config/axios'

import Section from '../../../components/Section'
import Header from '../../../components/Header'
import SuperSession from '../../../components/SuperSession'
import Button from '../../../components/ui/Button'

const validateEmail = (email: string): boolean => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

class Invitations extends React.Component {

  state: {
    showSuperSession: boolean,
    successMessage?: string,
    errorMessage?: string,
    emailValue: string,
  } = {
    showSuperSession: false,
    emailValue: '',
  }

  private sendInvitation = () => {
    const email = this.state.emailValue

    if (!validateEmail(email)) {
      this.setState({ successMessage: '', errorMessage: `${email} is not valid e-mail address.` })
      return
    }

    axios.post('users/invite', `email=${email}`)
      .then(() => {
        console.log(`Invitation sent to ${email}`)
        this.setState({ emailValue: '', successMessage: `Invitation sent to ${email}`, errorMessage: '' })
      })
      .catch((e) => {
        this.setState({ showSuperSession: true, successMessage: '', errorMessage: e.message })
      })
  }

  private superSessionSuccess = () => {
    this.sendInvitation()
    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    console.log('failure', e.message)
  }

  private updateEmailValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ emailValue: e.target.value })
  }

  public render() {
    const { showSuperSession, emailValue, successMessage, errorMessage } = this.state

    return (
      <div className="container">
        {
          showSuperSession ?
            <SuperSession 
              onSuccess={this.superSessionSuccess} 
              onFailure={this.superSessionFailure}
              onAbort={() => this.setState({ showSuperSession: false })}/>
          : null
        }
        <Section>
          <Header i18nKey="Invitations.title" />
          <div className="section__content">
            <form>
              {
                successMessage ?
                  <div className="success">{successMessage}</div>
                : null
              }
              {
                errorMessage ?
                  <div className="error">{errorMessage}</div>
                : null
              }
              <input
                type="email"
                value={emailValue}
                onChange={(e) => this.updateEmailValue(e)}
                placeholder="E-mail address"/>
              <br/>
              <Button color="green" size="medium" clickHandler={this.sendInvitation}>
                <Trans i18nKey="Buttons.invite" />
              </Button>
            </form>
          </div>
        </Section>
      </div>
    )
  }
}

export default Invitations
