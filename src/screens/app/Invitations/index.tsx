import './index.css'

import * as React from 'react'
import { Trans } from 'react-i18next'

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
          <Header i18nKey="Invitations.title"/>
          <div className="section__content">
            <div className="invitatio">
              <Input
                type="email"
                value={emailValue}
                onChange={(val) => this.setState({ emailValue: val })}
                isValid={(status) => {this.state.isEmailVaild !== status ? this.setState({ isEmailVaild: status}) : null}}
                placeholder="E-mail address"
                validation={{email: true}}
                errorMessage="This is not valid email address."
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
