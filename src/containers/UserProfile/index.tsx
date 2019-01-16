import './index.css'

import * as React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { FilesError } from 'react-files'

import i18n from 'src/i18n'
import validateEmail from 'src/helpers/validateEmail'
import decodeHtmlEntity from 'src/helpers/decodeHtmlEntity'

import * as api from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import UserUI from 'src/components/UserUI'
import Load from 'src/components/Load'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'
import Avatar from 'src/components/ui/Avatar'
import Input from 'src/components/ui/Input'

import FilesUploader from 'src/containers/FilesUploader'

import { State } from 'src/store/reducers'

type Props = {
  userId: string
  user: api.User
  currentUser: api.User
}

const mapStateToProps = ({ user: { user } }: State) => {
  return {
    currentUser: user,
  }
}

async function loader({ userId }: { userId: string }) {
  const user = await api.User.load(userId)

  return { user }
}

class UserProfile extends React.Component<Props> {
  state: {
    showDialog: boolean
    updateAction: 'avatar' | 'bio' | 'name' | 'email' | null
    files: File[]
    nameInput: string
    // bioInput: string
    // emailInput: string
  } = {
    showDialog: false,
    updateAction: null,
    files: [],
    nameInput: this.props.user.name,
    // bioInput: '',
    // emailInput: '',
  }

  private showUpdateAvatar = () => {
    this.setState({ showDialog: true, updateAction: 'avatar' })
  }

  private onFilesChange = (files: File[]) => {
    this.setState({ files })
  }

  private onFilesError = (error: FilesError, file: File) => {
    store.dispatch(addAlert('error', error.message))
  }

  private showUpdateName = () => {
    this.setState({ showDialog: true, updateAction: 'name' })
  }

  private updateNameInput = (val: string) => {
    this.setState({ nameInput: val })
  }

  private showUpdateBio = () => {
    this.setState({ showDialog: true, updateAction: 'bio' })
  }

  private updateBioInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target as HTMLTextAreaElement
    this.setState({ bioInput: input.value })
  }

  private showUpdateEmail = () => {
    this.setState({ showDialog: true, updateAction: 'email' })
  }

  private updateEmailInput = (val: string) => {
    this.setState({ emailInput: val })
  }

  private showDialogWithAction = () => {
    const { updateAction, nameInput/*, bioInput, emailInput*/ } = this.state
    let titlei18nKey = ''
    let body

    switch (updateAction){
      case 'avatar':
        titlei18nKey = 'Profile.updateAvatar'
        body = (
          <FilesUploader
            onFilesChange={this.onFilesChange}
            onFilesError={this.onFilesError}
            accepts={['.jpg', 'jpeg', '.png']}
            multiple={false}
          />
        )
        break
      case 'name':
        titlei18nKey = 'Profile.updateName'
        body = (
          <Input
            value={nameInput}
            onChange={this.updateNameInput}
            autoFocus
            validation={{minLength: 3}}
            errorMessage={i18n.t("Profile.nameValidation")}
          />
        )
        break
      /*case 'bio':
        titlei18nKey = 'Profile.updateBio'
        body = (
          <textarea
            value={bioInput}
            onChange={this.updateBioInput}
          />
        )
        break
      case 'email':
        titlei18nKey = 'Profile.updateEmail'
        body = (
          <Input
            value={emailInput}
            onChange={this.updateEmailInput}
            autoFocus
            validation={{email: true}}
            errorMessage={i18n.t("Profile.emailValidation")}
          />
        )
        break*/
    }

    return (
      <Dialog onClose={this.closeDialog} i18nKey={titlei18nKey}>
        <div className="profile__update-dialog">
          {body}
          <Button clickHandler={this.confirmUpdateAction}>
            <Trans i18nKey="Buttons.confirm"/>
          </Button>
        </div>
      </Dialog>
    )
  }

  private closeDialog = () => {
    const user = this.props.user
    this.setState({
      showDialog: false,
      updateAction: null,
      files: [],
      nameInput: user && user.name ? user.name : '',
      // bioInput: user && user.bio ? user.bio : '',
      // emailInput: user && user.email ? user.email : '',
    })
  }

  private confirmUpdateAction = () => {
    const updateAction = this.state.updateAction

    // TODO: not yet implemented on the server
    /*switch (updateAction) {
      case 'avatar':
        const files = this.state.files

        if (files.length === 0) {
          return store.dispatch(addAlert('error', i18n.t("Profile.avatarValidation")))
        }

        axios.put('users/me', {avatar: files[0]})
          .then(() => {
            store.dispatch(addAlert('success', i18n.t("Profile.avatarUpdateSuccess")))
          })
          .catch(e => {
            store.dispatch(addAlert('error', e.message))
          })
        break
      case 'name':
        const nameInput = this.state.nameInput

        if (nameInput.length < 3) {
          return store.dispatch(addAlert('error', i18n.t("Profile.nameValidation")))
        }

        axios.put('users/me', {name: nameInput})
          .then(() => {
            store.dispatch(addAlert('success', i18n.t("Profile.nameUpdateSuccess")))
          })
          .catch(e => {
            store.dispatch(addAlert('error', e.message))
          })
        break
      case 'bio':
        axios.put('users/me', {bio: this.state.bioInput})
          .then(() => {
            store.dispatch(addAlert('success', i18n.t("Profile.bioUpdateSuccess")))
          })
          .catch(e => {
            store.dispatch(addAlert('error', e.message))
          })
        break
      case 'email':
        const emailInput = this.state.emailInput

        if (!validateEmail(emailInput)) {
          return store.dispatch(addAlert('error', i18n.t("Profile.emailValidation")))
        }

        axios.put('users/me', {email: emailInput})
          .then(() => {
            store.dispatch(addAlert('success', i18n.t("Profile.emailUpdateSuccess")))
          })
          .catch(e => {
            store.dispatch(addAlert('error', e.message))
          })
        break
    }*/

    this.closeDialog()
  }

  public render() {
    const showDialog = this.state.showDialog
    const user = this.props.user
    let title
    if (this.props.userId === 'me') {
      title = 'Your profile'
    } else if (user && user.name) {
      title = decodeHtmlEntity(user.name)
    }

    return (
      <React.Fragment>
        {
          showDialog ?
            this.showDialogWithAction()
          : null
        }
        <Section>
          <Header title={title ? title : i18n.t("Unknown.user")} />
          <div className="section__content">
            <div className="profile">
              <div className="profile__top">
                <div className="profile__avatar">
                  <Avatar size="big" disableLink user={user}/>
                  <UserUI userId={user.id}>
                    <span
                      className="profile__update-avatar"
                      onClick={this.showUpdateAvatar}
                    >
                      <Icon name="pencil"/>
                    </span>
                  </UserUI>
                </div>
                <h2 className="profile__name">
                  {decodeHtmlEntity(user.name)}
                  <UserUI userId={user.id}>
                    <span
                      className="profile__update-name"
                      onClick={this.showUpdateName}
                    >
                      <Icon size="small" name="pencil"/>
                    </span>
                  </UserUI>
                </h2>
              </div>
              <div className="profile__info">
                <h3 className="profile__title">
                  <Trans i18nKey="Profile.bio"/>
                </h3>
                <div className="profile__bio">
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio nisi facilis ad facere minus laborum soluta illo maiores illum atque enim aliquid commodi adipisci vel amet, porro delectus at nesciunt.
                  </p>
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga aspernatur quos quidem quas explicabo porro, minima quia cupiditate magnam.
                  </p>
                  <UserUI userId={user.id}>
                    <span className="profile__update-bio" onClick={this.showUpdateBio}>
                      <Icon size="small" name="pencil"/>
                    </span>
                  </UserUI>
                </div>
                <h3 className="profile__title">
                  <Trans i18nKey="Profile.contact"/>
                </h3>
                <span className="profile__email">
                  {/*email: {user.email ? user.email : i18n.t("Unknown.email")}*/}
                  <UserUI userId={user.id}>
                    <span className="profile__update-email" onClick={this.showUpdateEmail}>
                      <Icon size="small" name="pencil"/>
                    </span>
                  </UserUI>
                </span>
              </div>
            </div>
          </div>
        </Section>
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps)(Load(loader)(UserProfile))
