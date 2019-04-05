import './index.css'

import * as React from 'react'
import { History } from 'history'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import decodeHtmlEntity from 'src/helpers/decodeHtmlEntity'

import * as api from 'src/api'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import Avatar from 'src/components/ui/Avatar'

import UserProfile from 'src/containers/UserProfile'

import { TeamMap } from 'src/store/types'
import { State } from 'src/store/reducers'

type Props = {
  match: {
    params: {
      id: string
    }
  }
  history: History
  team: {
    teamMap: TeamMap
  }
  currentUser: api.User
}

const mapStateToProps = ({ team }: State) => {
  return {
    team,
  }
}

const profile = ({ match, team: { teamMap } }: Props) => {

  const listOfTeamMembers = (teamMap: TeamMap) => {
    let team: api.User[] = []
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
                    {decodeHtmlEntity(user.name)}
                  </span>
                </Link>
              </li>
            )
          })
        }
      </ul>
    )
  }

  return (
    <div className="container container--splitted">
      <UserProfile
        userId={match.params.id}
        user={new api.User({id: 0, name: 'Loading...', role: null})}
      />
      <Section>
        <Header l10nId="user-profile-section-team" title="Your team" />
        <div className="section__content">
          {
            teamMap.size ?
              listOfTeamMembers(teamMap)
            : <Spinner/>
          }
        </div>
      </Section>
    </div>
  )
}

export default connect(mapStateToProps)(profile)
