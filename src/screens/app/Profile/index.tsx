import * as React from 'react'
import { History } from 'history'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import axios from 'src/config/axios'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'
import Avatar from 'src/components/ui/Avatar'

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
  } = {
    user: undefined
  }

  private listOfTeamMembers = (teamMap: TeamMap) => {
    let team: User[] = []
    teamMap.forEach(user => team.push(user))

    return (
      <ul className="teamList">
        {
          team.map(user => {
            return (
              <li>
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
        this.setState({ user: res.data })
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
    const { user } = this.state
    const { teamMap } = this.props.team
    let title
    if (this.props.match.params.id === 'me') {
      title = 'Your profile'
    } else if (user && user.name) {
      title = user.name
    }

    return (
      <div className="container container--splitted">
        <Section>
          <Header title={title ? title : 'Unknow user'} />
          <div className="section__content">
            {
              user ?
                <div className="user">
                  <div className="user__top">
                    <Avatar size="big" disableLink user={user}/>
                    <h2 className="user__name">{user.name}</h2>
                  </div>
                  <div className="user__info">
                    <div className="user__bio">
                      <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio nisi facilis ad facere minus laborum soluta illo maiores illum atque enim aliquid commodi adipisci vel amet, porro delectus at nesciunt.
                      </p>
                      <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga aspernatur quos quidem quas explicabo porro, minima quia cupiditate magnam.
                      </p>
                    </div>
                    <span className="user__email">
                      email: {user.email ? user.email : 'unknow email'}
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
