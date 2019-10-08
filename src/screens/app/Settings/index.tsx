import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import User from 'src/api/user'
import store from 'src/store'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/alerts'
import { setLocale } from 'src/store/actions/app'

import { confirmDialog } from 'src/helpers'

import Header from 'src/components/Header'
import Input from 'src/components/ui/Input'

import { languages as LANGUAGES } from 'src/locale/data.json'

import './index.css'

interface SettingsProps {
  locale: string[],
  user: User,
}

const mapStateToProps = ({ app: { locale }, user: { user } }: State) => ({
  locale,
  user,
})

interface SettingsState {
  arePasswordsValid: boolean
  oldPassword: string
  newPassword: string
  newPassword2: string
}

class Settings extends React.Component<SettingsProps> {
  state: SettingsState = {
    arePasswordsValid: false,
    oldPassword: '',
    newPassword: '',
    newPassword2: '',
  }

  private handleLanguageChange = async (
    { value }: { value: typeof LANGUAGES[0], label: string }
  ) => {
    const res = await confirmDialog({
      title: 'settings-language-dialog-title',
      buttons: {
        cancel: 'settings-language-dialog-cancel',
        confirm: 'settings-language-dialog-confirm',
      },
      showCloseButton: false,
    })

    if (res === 'confirm') {
      this.changeLanguage(value)
    }
  }

  private changeLanguage = (value: typeof LANGUAGES[0]) => {
    this.props.user.changeLanguage(value.code)
    store.dispatch(setLocale([value.code]))
  }

  private validatePasswords = () => {
    const { oldPassword, newPassword, newPassword2 } = this.state

    if (oldPassword.length > 3 && newPassword.length > 3 && newPassword === newPassword2) {
      return this.setState({ arePasswordsValid: true })
    }

    return this.setState({ arePasswordsValid: false })
  }

  private updateOldPassword = (val: string) => {
    this.setState({ oldPassword: val }, this.validatePasswords)
  }

  private updateNewPassword = (val: string) => {
    this.setState({ newPassword: val }, this.validatePasswords)
  }

  private updateNewPassword2 = (val: string) => {
    this.setState({ newPassword2: val }, this.validatePasswords)
  }

  private changePassword = (e: React.FormEvent) => {
    e.preventDefault()

    const { oldPassword, newPassword, newPassword2 } = this.state

    User.changePassword(oldPassword, newPassword, newPassword2)
      .then(() => {
        this.clearPasswordForm()
        store.dispatch(addAlert('success', 'settings-change-password-alert-success'))
      })
      .catch(e => {
        store.dispatch(addAlert('error', 'settings-change-password-alert-error'))
        console.error(e)
      })
  }

  private clearPasswordForm = () => {
    this.setState({
      arePasswordsValid: false,
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
    })
  }

  public render() {
    const { locale } = this.props
    const {
      arePasswordsValid,
      oldPassword,
      newPassword,
      newPassword2,
    } = this.state

    const language = LANGUAGES.find(lang => lang.code === locale[0])

    return (
      <section className="section--wrapper">
        <Header l10nId="settings-view-title" title="Settings" />
        <div className="section__content">
          <div className="settings">
            <h2 className="settings__title">
              <Localized id="settings-section-language">
                Change language
              </Localized>
            </h2>
            <Select
              className="react-select"
              value={language ? { value: language, label: language.name } : null}
              onChange={this.handleLanguageChange}
              options={LANGUAGES.map(lan => ({ value: lan, label: lan.name }))}
              formatOptionLabel={formatOptionLabel}
            />
            <h2 className="settings__title">
              <Localized id="settings-section-password">
                Change password
              </Localized>
            </h2>
            <form onSubmit={this.changePassword}>
              <Input
                type="password"
                l10nId="settings-value-old-password"
                value={oldPassword}
                onChange={this.updateOldPassword}
                errorMessage="settings-validation-password-bad-length"
              />
              <Input
                type="password"
                l10nId="settings-value-new-password"
                value={newPassword}
                onChange={this.updateNewPassword}
                errorMessage="settings-validation-password-bad-length"
              />
              <Input
                type="password"
                l10nId="settings-value-new-password-repeat"
                value={newPassword2}
                onChange={this.updateNewPassword2}
                validation={{ sameAs: newPassword }}
                errorMessage="settings-validation-password-no-match"
              />
              <Localized id="settings-password-change" attrs={{ value: true }}>
                <input type="submit" value="Confirm" disabled={!arePasswordsValid} />
              </Localized>
            </form>
          </div>
        </div>
      </section>
    )
  }
}

export default connect(mapStateToProps)(Settings)

const formatOptionLabel = (option: { label: string, value: any }) => option.label
