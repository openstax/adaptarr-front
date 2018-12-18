import * as React from 'react'
import axiosClean from 'axios'
import { Trans } from 'react-i18next'


import Dialog from './ui/Dialog'
import Button from './ui/Button'

type Props = {
  onSuccess: (response: any) => any
  onFailure: (error: Error) => any
  onAbort: () => any
}

 class SuperSession extends React.Component<Props> {

  state: {
    errorMessage: string
  } = {
    errorMessage: '',
  }

  private confirmSuperSession = () => {
    const input = this.passwordInput.current as HTMLInputElement
    const password = input ? input.value : null
    if (password) {
      return new Promise((resolve, reject) => {
        axiosClean.post('/elevate', `password=${password}`)
          .then(res => {
            console.log('starting super session')
            this.setState({ errorMessage: '' })
            resolve(this.props.onSuccess(res))
          })
          .catch(e => {
            console.log(`Couldn't start super session. Details: ${e.message}`)
            this.setState({ errorMessage: e.message })
            reject(this.props.onFailure(e))
          })
      })
    }

    const errorMessage = 'You have to provide password.'
    this.setState({ errorMessage })

    return this.props.onFailure(new Error(errorMessage))
  }

  private passwordInput: React.RefObject<HTMLInputElement> = React.createRef()

  public render() {
    const { errorMessage } = this.state

    return (
      <Dialog 
        onClose={this.props.onAbort} 
        i18nKey="Admin.confirmSuperSession"
        className="supersession"
      >
        <form>
          {
            errorMessage ?
              <span className="error">{errorMessage}</span>
            : null
          }
          <input 
            type="password" 
            ref={this.passwordInput} 
            name="password" 
            placeholder="Password"
            autoFocus />
          <Button clickHandler={this.confirmSuperSession}>
            <Trans i18nKey="Buttons.confirm" />
          </Button>
        </form>
      </Dialog>
    )
  }
}

export default SuperSession
