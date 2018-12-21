import * as React from 'react'
import { Trans } from 'react-i18next'

import axios from 'src/config/axios'
import validateEmail from 'src/helpers/validateEmail'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import SuperSession from 'src/components/SuperSession'
import Button from 'src/components/ui/Button'

class Invitations extends React.Component {

  state: {
    showSuperSession: boolean,
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

    axios.post('users/invite', {email})
      .then(() => {
        this.setState({ emailValue: '' })
        store.dispatch(addAlert('success', `Invitation sent to ${email}`))
      })
      .catch((e) => {
        if (e.request.status === 403) {
          this.setState({ showSuperSession: true })
          store.dispatch(addAlert('info', 'You have to confirm this action.'))
        } else {
          store.dispatch(addAlert('error', e.message))
        }
      })
  }

  private superSessionSuccess = () => {
    this.sendInvitation()
    this.setState({ showSuperSession: false })
  }

  private superSessionFailure = (e: Error) => {
    store.dispatch(addAlert('error', e.message))
  }

  private updateEmailValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ emailValue: e.target.value })
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
              onAbort={() => this.setState({ showSuperSession: false })}/>
          : null
        }
        <Section>
          <Header i18nKey="Invitations.title" />
          <div className="section__content">
            <form>
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
