import * as React from 'react'
import axiosClean from 'axios'

import i18n from 'src/i18n'

import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

type Props = {
  onSuccess: (response: any) => any
  onFailure: (error: Error) => any
  onAbort: () => any
}

 class SuperSession extends React.Component<Props> {

  state: {
    errorMessage: string
    passwordInput: string
  } = {
    errorMessage: '',
    passwordInput: '',
  }

  private confirmSuperSession = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()

    const password = this.state.passwordInput

    if (password) {
      new Promise((resolve, reject) => {
        axiosClean.post('/elevate', `password=${password}`)
          .then(res => {
            this.setState({ errorMessage: '' })
            resolve(this.props.onSuccess(res))
          })
          .catch(e => {
            this.setState({ errorMessage: e.message })
            reject(this.props.onFailure(e))
          })
      })
      return
    }

    const errorMessage = i18n.t("SuperSession.providePass") as string
    this.setState({ errorMessage })

    this.props.onFailure(new Error(errorMessage as string))
  }

  public render() {
    const { errorMessage } = this.state

    return (
      <Dialog 
        onClose={this.props.onAbort} 
        i18nKey="Admin.confirmSuperSession"
        className="supersession"
      >
        <form onSubmit={this.confirmSuperSession}>
          {
            errorMessage ?
              <span className="error">{errorMessage}</span>
            : null
          }
          <Input
            type="password"
            onChange={(val) => this.setState({ passwordInput: val })}
            placeholder={i18n.t("SuperSession.placeholderPass") as string}
            autoFocus
          />
          <input type="submit" value={i18n.t("Buttons.confirm") as string} />
        </form>
      </Dialog>
    )
  }
}

export default SuperSession
