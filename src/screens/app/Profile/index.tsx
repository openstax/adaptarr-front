import * as React from 'react'
import { History } from 'history'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FilesError } from 'react-files'

import axios from 'src/config/axios'
import validateEmail from 'src/helpers/validateEmail'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import UserUI from 'src/components/UserUI'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Dialog from 'src/components/ui/Dialog'
import Avatar from 'src/components/ui/Avatar'
import Input from 'src/components/ui/Input'

import FilesUploader from 'src/containers/FilesUploader'

import { User, TeamMap } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  match: {
    params: {
      id: string
    }
  }
  history: History
  user: {
    user: User
  }
  team: {
    teamMap: TeamMap
  }
}

const mapStateToProps = ({ user, team }: State) => {
  return {
    user,
    team,
  }
}

class Profile extends React.Component<Props> {
  state: {
    user: User | undefined
    showDialog: boolean
    updateAction: 'avatar' | 'bio' | 'name' | 'email' | null
    files: File[]
    nameInput: string
    bioInput: string
    emailInput: string
  } = {
    user: undefined,
    showDialog: false,
    updateAction: null,
    files: [],
    nameInput: '',
    bioInput: '',
    emailInput: '',
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
    const { updateAction, nameInput, bioInput, emailInput } = this.state
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
            errorMessage="Name has to be at least 3 characters long."
          />
        )
        break
      case 'bio':
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
            errorMessage="This is not a valid email address."
          />
        )
        break
    }

    return (
      <Dialog onClose={() => this.closeDialog()} i18nKey={titlei18nKey}>
        <div className="user__update-dialog">
          {body}
          <Button clickHandler={() => this.confirmUpdateAction()}>
            <Trans i18nKey="Buttons.confirm"/>
          </Button>
        </div>
      </Dialog>
    )
  }

  private closeDialog = () => {
    const user = this.state.user
    this.setState({ 
      showDialog: false, 
      updateAction: null,
      files: [],
      nameInput: user && user.name ? user.name : '',
      bioInput: user && user.bio ? user.bio : '',
      emailInput: user && user.email ? user.email : '',
    })
  }

  private confirmUpdateAction = () => {
    const updateAction = this.state.updateAction

    switch (updateAction) {
      case 'avatar':
        const files = this.state.files
        
        if (files.length === 0) {
          return store.dispatch(addAlert('error', 'You have to provide file.'))
        }

        axios.put('users/me', {avatar: files[0]})
          .then(() => {
            store.dispatch(addAlert('success', 'Successfully update your avatar.'))
          })
          .catch(e => {
            store.dispatch(addAlert('error', e.message))
          })
        break
      case 'name':
        const nameInput = this.state.nameInput

        if (nameInput.length < 3) {
          return store.dispatch(addAlert('error', 'Name has to be at least 3 characters long.'))
        }

        axios.put('users/me', {name: nameInput})
          .then(() => {
            store.dispatch(addAlert('success', 'Successfully update your name.'))
          })
          .catch(e => {
            store.dispatch(addAlert('error', e.message))
          })
        break
      case 'bio':
        axios.put('users/me', {bio: this.state.bioInput})
          .then(() => {
            store.dispatch(addAlert('success', 'Successfully updated your bio.'))
          })
          .catch(e => {
            store.dispatch(addAlert('error', e.message))
          })
        break
      case 'email':
        const emailInput = this.state.emailInput

        if (!validateEmail(emailInput)) {
          return store.dispatch(addAlert('error', 'This is not valid email address.'))
        }

        axios.put('users/me', {email: emailInput})
          .then(() => {
            store.dispatch(addAlert('success', 'Successfully update your email.'))
          })
          .catch(e => {
            store.dispatch(addAlert('error', e.message))
          })
        break
    }

    this.closeDialog()
  }

  private listOfTeamMembers = (teamMap: TeamMap) => {
    let team: User[] = []
    teamMap.forEach(user => team.push(user))

    return (
      <ul className="teamList">
        {
          team.map(user => {
            return (
              <li key={user.id}>
                <Link to={`/users/${user.id}`} className="teamList__item">
                  <Avatar disableLink size="small" user={user}/>
                  <span className="teamList__username">
                    {user.name}
                  </span>
                </Link>
              </li>
            )
          })
        }
      </ul>
    )
  }

  private fetchUserInfo = () => {
    const userId = this.props.match.params.id

    this.setState({ isLoading: true })

    axios.get(`users/${userId}`)
      .then(res => {
        this.setState({ 
          user: res.data,
          nameInput: res.data.name || '',
          bioInput: res.data.bio || '',
          emailInput: res.data.email || '',
        })
      })
      .catch(() => {
        this.props.history.push('/404')
      })
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchUserInfo()
    }
  }

  componentDidMount = () => {
    this.fetchUserInfo()
  }

  public render() {
    const { user, showDialog } = this.state
    const { teamMap } = this.props.team
    let title
    if (this.props.match.params.id === 'me') {
      title = 'Your profile'
    } else if (user && user.name) {
      title = user.name
    }

    return (
      <div className="container container--splitted">
        {
          showDialog ?
            this.showDialogWithAction()
          : null
        }
        <Section>
          <Header title={title ? title : 'Unknow user'} />
          <div className="section__content">
            {
              user ?
                <div className="user">
                  <div className="user__top">
                    <div className="user__avatar">
                      <Avatar size="big" disableLink user={user}/>
                      <UserUI userId={user.id}>
                        <span 
                          className="user__update-avatar"
                          onClick={this.showUpdateAvatar}
                        >
                          <Icon name="pencil"/>
                        </span>
                      </UserUI>
                    </div>
                    <h2 className="user__name">
                      {user.name}
                      <UserUI userId={user.id}>
                        <span
                          className="user__update-name"
                          onClick={this.showUpdateName}
                        >
                          <Icon size="small" name="pencil"/>
                        </span>
                      </UserUI>
                    </h2>
                  </div>
                  <div className="user__info">
                    <h3 className="user__title">
                      <Trans i18nKey="Profile.bio"/>
                    </h3>
                    <div className="user__bio">
                      <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio nisi facilis ad facere minus laborum soluta illo maiores illum atque enim aliquid commodi adipisci vel amet, porro delectus at nesciunt.
                      </p>
                      <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga aspernatur quos quidem quas explicabo porro, minima quia cupiditate magnam.
                      </p>
                      <UserUI userId={user.id}>
                        <span className="user__update-bio" onClick={this.showUpdateBio}>
                          <Icon size="small" name="pencil"/>
                        </span>
                      </UserUI>
                    </div>
                    <h3 className="user__title">
                      <Trans i18nKey="Profile.contact"/>
                    </h3>
                    <span className="user__email">
                      email: {user.email ? user.email : 'unknow email'}
                      <UserUI userId={user.id}>
                        <span className="user__update-email" onClick={this.showUpdateEmail}>
                          <Icon size="small" name="pencil"/>
                        </span>
                      </UserUI>
                    </span>
                  </div>
                </div>
              : <Spinner/>
            }
          </div>
        </Section>
        <Section>
          <Header i18nKey="Profile.yourTeam"/>
          <div className="section__content">
            {
              teamMap.size ?
                this.listOfTeamMembers(teamMap)
              : <Spinner/>
            }
          </div>
        </Section>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Profile)
