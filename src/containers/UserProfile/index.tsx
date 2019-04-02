import './index.css'

import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'
import { FilesError } from 'react-files'

import validateEmail from 'src/helpers/validateEmail'
import decodeHtmlEntity from 'src/helpers/decodeHtmlEntity'

import * as api from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'
import { fetchUser } from 'src/store/actions/User'

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
import LimitedUI from 'src/components/LimitedUI';

type Props = {
  user: api.User
  currentUser: api.User
  roles: api.Role[],
}

const mapStateToProps = ({ user: { user }, app: { roles } }: State) => {
  return {
    currentUser: user,
    roles,
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
    permissions: number[]
    // bioInput: string
    // emailInput: string
  } = {
    showDialog: false,
    updateAction: null,
    files: [],
    nameInput: this.props.user.name,
    permissions: [],
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
    let l10nId
    let placeholder
    let body

    switch (updateAction){
      case 'avatar':
        l10nId = 'user-profile-update-avatar-title'
        placeholder = 'Upload file for your avatar.'
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
        l10nId = 'user-profile-update-name-title'
        placeholder = 'Update your name.'
        body = (
          <Input
            value={nameInput}
            onChange={this.updateNameInput}
            autoFocus
            validation={{minLength: 3}}
            errorMessage="user-profile-name-validation-error"
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

      default:
        throw new Error('Bad update action: ' + updateAction)
    }

    return (
      <Dialog
        l10nId={l10nId}
        placeholder={placeholder}
        onClose={this.closeDialog}
      >
        <div className="profile__update-dialog">
          {body}
          <Button clickHandler={this.confirmUpdateAction}>
            <Localized id="user-profile-update-confirm" />
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

  private handleRoleChange = (role: api.Role) => {
    this.props.user.changeRole(role.id)
      .then(() => {
        store.dispatch(fetchUser())
        store.dispatch(addAlert('success', 'user-profile-change-role-success', {name: role.name}))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', 'user-profile-change-role-error', {details: e.response.data.error}))
      })
  }

  private handleRoleUnassign = () => {
    this.props.user.changeRole(null)
      .then(() => {
        store.dispatch(fetchUser())
        store.dispatch(addAlert('success', 'user-profile-unassign-role-success'))
      })
      .catch((e) => {
        store.dispatch(addAlert('error', 'user-profile-unassign-role-error', {details: e.response.data.error}))
      })
  }

  public render() {
    const showDialog = this.state.showDialog
    const user = this.props.user
    let header
    if (this.props.user.apiId === 'me') {
      header = <Header l10nId="user-profile-view-title-your" title="Your profile" />
    } else {
      header = <Header
        l10nId="user-profile-view-title-named"
        title={decodeHtmlEntity(user.name) + "'s profile"}
        $name={decodeHtmlEntity(user.name)}
        />
    }

    return (
      <React.Fragment>
        {
          showDialog ?
            this.showDialogWithAction()
          : null
        }
        <Section>
          {header}
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
                  <Localized id="user-profile-section-role">User's role:</Localized>
                </h3>
                <span className="profile__role">
                  {
                    user.role ?
                      user.role.name
                    :
                      <Localized id="user-profile-role-unknown">
                        Unknow role
                      </Localized>
                  }
                </span>
                <LimitedUI permissions="user:assign-role">
                  <Select
                    className="profile__select"
                    value={this.props.user.role}
                    options={this.props.roles}
                    formatOptionLabel={(role) => role.name}
                    onChange={this.handleRoleChange}
                  />
                  <Button
                    className="profile__button--unassign-role"
                    clickHandler={this.handleRoleUnassign}
                  >
                    <Localized id="user-profile-section-role-unassign">
                      Unassign user from role
                    </Localized>
                  </Button>
                </LimitedUI>
                <h3 className="profile__title">
                  <Localized id="user-profile-section-bio">Bio</Localized>
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
                  <Localized id="user-profile-section-contact">Contact</Localized>
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

export default connect(mapStateToProps)(Load(loader, ['userId'])(UserProfile))
