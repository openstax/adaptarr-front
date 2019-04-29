import './index.css'

import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import User from 'src/api/user'
import store from 'src/store'
import { State } from 'src/store/reducers'
import { addAlert } from 'src/store/actions/Alerts'
import { setLocale } from 'src/store/actions/app'

import Header from 'src/components/Header'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import Input from 'src/components/ui/Input'

import { languages as LANGUAGES } from 'src/locale/data.json'

type Props = {
  locale: string[],
  availableLocales: string[],
  user: User,
}

const mapStateToProps = ({ app, user: { user } }: State) => ({
  locale: app.locale,
  availableLocales: app.availableLocales,
  user: user,
})

class Settings extends React.Component<Props> {
  state: {
    newSelectedLanguage: typeof LANGUAGES[0] | null
    showChangeLanguage: boolean
    arePasswordsValid: boolean
    oldPassword: string
    newPassword: string
    newPassword2: string
  } = {
    newSelectedLanguage: null,
    showChangeLanguage: false,
    arePasswordsValid: false,
    oldPassword: '',
    newPassword: '',
    newPassword2: '',
  }

  private handleLanguageChange = (selectedLanguage: typeof LANGUAGES[0]) => {
    this.setState({ showChangeLanguage: true, newSelectedLanguage: selectedLanguage })
  }

  private changeLanguage = () => {
    const newSelectedLanguage = this.state.newSelectedLanguage

    if (!newSelectedLanguage) return

    this.props.user.changeLanguage(newSelectedLanguage.code)
    store.dispatch(setLocale([newSelectedLanguage.code]))
    this.setState({ showChangeLanguage: false })
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
        console.log(e)
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

  private closeChangeLanguage = () => {
    this.setState({ showChangeLanguage: false })
  }

  public render() {
    const { locale, availableLocales } = this.props
    const {
      arePasswordsValid,
      showChangeLanguage,
      oldPassword,
      newPassword,
      newPassword2,
    } = this.state

    const language = LANGUAGES.find(lang => lang.code === locale[0])

    const languageOptions = availableLocales.map(locale =>
      LANGUAGES.find(lang => lang.code === locale)
    )

    return (
      <section className="section--wrapper">
        {
          showChangeLanguage ?
            <Dialog
              l10nId="settings-language-dialog-title"
              placeholder="Are you sure you want to change language?"
              onClose={this.closeChangeLanguage}
            >
              <Button
                color="green"
                clickHandler={this.changeLanguage}
              >
                <Localized id="settings-language-dialog-confirm">
                  Confirm
                </Localized>
              </Button>
              <Button
                color="red"
                clickHandler={this.closeChangeLanguage}
              >
                <Localized id="settings-language-dialog-cancel">
                  Cancel
                </Localized>
              </Button>
            </Dialog>
          : null
        }
        <Header l10nId="settings-view-title" title="Settings" />
        <div className="section__content">
          <div className="settings">
            <h2 className="settings__title">
              <Localized id="settings-section-language">
                Change language
              </Localized>
            </h2>
            <Select
              value={language}
              onChange={this.handleLanguageChange}
              options={languageOptions}
              className="settings__select"
              getOptionLabel={getOptionLabel}
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
                validation={{sameAs: newPassword}}
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

function getOptionLabel({ name }: typeof LANGUAGES[0]) {
  return name
}
