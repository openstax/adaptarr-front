import * as React from 'react'
import { History } from 'history'
import { connect } from 'react-redux'

import { User } from 'src/api'

import { UsersMap, TeamsMap } from 'src/store/types'
import { State } from 'src/store/reducers'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'

import UserProfile from 'src/containers/UserProfile'
import UsersList from 'src/containers/UsersList'

import './index.css'

export type ProfileProps = {
  match: {
    params: {
      id: string
    }
  }
  history: History
  user: User
  users: UsersMap
  teams: TeamsMap
}

const mapStateToProps = ({ user: { user, users }, app: { teams } }: State) => {
  return {
    user,
    users,
    teams,
  }
}

const Profile = ({ match, history, user, users, teams }: ProfileProps) => {
  const goToUserProfile = (user: User) => {
    history.push(`/users/${user.apiId}`)
  }

  return (
    <div className="container container--splitted">
      <UserProfile
        userId={match.params.id}
        user={user}
      />
      <Section>
        <Header l10nId="user-profile-section-teams-members" title="Your teams' members" />
        <div className="section__content">
          {
            users.size ?
              <UsersList
                isSearchable={false}
                team={Array.from(teams.values())}
                onUserClick={goToUserProfile}
              />
            : <Spinner/>
          }
        </div>
      </Section>
    </div>
  )
}

export default connect(mapStateToProps)(Profile)
