import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import { Draft, User } from 'src/api'

import store from 'src/store'
import { addAlert } from 'src/store/actions/alerts'
import { updateUserInUsersMap } from 'src/store/actions/user'
import { State } from 'src/store/reducers'

import { confirmDialog, decodeHtmlEntity } from 'src/helpers'

import { useIsInSuperMode } from 'src/hooks'

import ProfileRoles from './ProfileRoles'
import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Load from 'src/components/Load'
import DraftsList from 'src/components/DraftsList'
import EditableText from 'src/components/EditableText'
import Avatar from 'src/components/ui/Avatar'
import Button from 'src/components/ui/Button'
import LimitedUI from 'src/components/LimitedUI'

import './index.css'

interface UserProfileProps {
  user: User
  loggedUser: User
}

const mapStateToProps = ({ user: { user } }: State) => ({
  loggedUser: user,
})

async function loader({ userId }: { userId: string }) {
  const user = await User.load(userId)

  return { user }
}

const UserProfile = (props: UserProfileProps) => {
  const [userName, setUserName] = React.useState(props.user.name)
  const [drafts, setDrafts] = React.useState<Draft[]>([])
  const [isSupport, setIsSupport] = React.useState(props.user.is_support)
  const isInSuperMode = useIsInSuperMode(props.user)

  const handleNameChange = (name: string) => {
    const { user, loggedUser } = props
    const usr = user.id === loggedUser.id ? loggedUser : user
    usr.changeName(name).then(res => {
      store.dispatch(addAlert('success', 'user-profile-update-name-success'))
      store.dispatch(updateUserInUsersMap({ ...res.data }))
      setUserName(name)
    })
      .catch(() => {
        store.dispatch(addAlert('success', 'user-profile-update-name-error'))
        setUserName(props.user.name)
      })
  }

  const toggleIsSupporFlag = async () => {
    const newState = !isSupport
    if (!newState) {
      const res = await confirmDialog({
        title: 'user-profile-support-flag-remove-confirm',
        size: 'medium',
        $user: user.name,
        buttons: {
          cancel: 'user-profile-support-flag-remove-confirm-cancel',
          remove: 'user-profile-support-flag-remove-confirm-remove',
        },
      })

      if (res !== 'remove') return
    }

    await user.setIsSupportFlag(newState)
      .then(() => {
        setIsSupport(newState)
        user.is_support = newState
      })
      .catch(() => {
        store.dispatch(addAlert('error', 'user-profile-support-flag-error'))
      })
  }

  const fetchUsersDrafts = async () => {
    const usersDrafts: Draft[] = await props.user.drafts()
    setDrafts(usersDrafts)
  }

  React.useEffect(() => {
    setUserName(props.user.name)
    setIsSupport(props.user.is_support)
    if (
      props.loggedUser.is_super
      || props.loggedUser.allPermissions.has('editing-process:manage')
    ) {
      fetchUsersDrafts()
    }
  }, [props.user.id])

  const { user, loggedUser } = props

  let header
  if (props.user.apiId === 'me') {
    header = <Header l10nId="user-profile-view-title-your" title="Your profile" />
  } else {
    header = (
      <Header
        l10nId="user-profile-view-title-named"
        title={decodeHtmlEntity(user.name) + "'s profile"}
        $name={decodeHtmlEntity(user.name)}
      />
    )
  }

  return (
    <Section>
      {header}
      <div className="section__content">
        <div className="profile">
          <div className="profile__top">
            <div className="profile__avatar">
              <Avatar size="big" disableLink user={user}/>
            </div>
            <div className="profile__main-info">
              <h2 className="profile__name">
                {
                  user.id === loggedUser.id || isInSuperMode ?
                    <EditableText
                      text={userName}
                      onAccept={handleNameChange}
                      minLength={3}
                      maxLength={30}
                    />
                    : decodeHtmlEntity(user.name)
                }
              </h2>
              <ProfileRoles user={user} loggedUser={loggedUser} />
            </div>
          </div>
          <div className="profile__info">
            <LimitedUI permissions="editing-process:manage">
              <h3 className="profile__title">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <Localized id="user-profile-users-drafts">User's drafts</Localized>
              </h3>
              <DraftsList drafts={drafts} />
            </LimitedUI>
          </div>
          <LimitedUI onlySuper={true}>
            <div className="profile__flags">
              <Button clickHandler={toggleIsSupporFlag}>
                <Localized
                  id={isSupport
                    ? 'user-profile-support-flag-remove'
                    : 'user-profile-support-flag-add'}
                >
                  Toggle support flag
                </Localized>
              </Button>
            </div>
          </LimitedUI>
        </div>
      </div>
    </Section>
  )
}

export default connect(mapStateToProps)(Load(loader, ['userId'])(UserProfile))
