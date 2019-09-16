import * as React from 'react'
import { connect } from 'react-redux'

import { Team } from 'src/api'

import store from 'src/store'
import { setTeams } from 'src/store/actions/app'
import { addAlert } from 'src/store/actions/Alerts'
import { State } from 'src/store/reducers'

import AddTeam from './components/AddTeam'
import RoleManager from './components/RoleManager'
import AddRole from './components/AddRole'
import Header from 'src/components/Header'
import Section from 'src/components/Section'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

type Props = {
  teams: Map<number, Team>
}

const mapStateToProps = ({ app: { teams } }: State) => {
  return {
    teams,
  }
}

type TeamsState = {
  isLoading: boolean
  selectedTeam: Team | undefined
}

class Teams extends React.Component<Props> {
  state: TeamsState = {
    isLoading: true,
    selectedTeam: undefined,
  }

  private selectTeam = (ev: React.MouseEvent) => {
    const teamId = (ev.target as HTMLLIElement).dataset.id
    const team = this.props.teams.get(Number(teamId))!
    this.setState({ selectedTeam: team })
  }

  private unselectTeam = () => {
    this.setState({ selectedTeam: undefined, roles: [] })
  }

  private fetchTeams = async () => {
    this.setState({ isLoading: true })
    await Team.all()
      .then(teams => {
        store.dispatch(setTeams(teams))
      })
      .catch(e => {
        store.dispatch(addAlert('error', 'teams-error-fetch'))
      })
    this.setState({ isLoading: false })
  }

  componentDidMount() {
    this.fetchTeams()
  }

  public render() {
    const { isLoading, selectedTeam } = this.state
    const { teams } = this.props

    if (isLoading) return <Spinner />

    return (
      <div className={`container ${selectedTeam ? 'container--splitted' : ''}`}>
        <Section className="teams">
          <Header l10nId="teams-section-manage-teams-title" title="Manage teams" />
          <div className="section__content">
            <AddTeam onSuccess={this.fetchTeams} />
            <ul className="teams__list">
              {
                Array.from(teams.values()).map(t => {
                  const isActive = selectedTeam && t.id === selectedTeam.id
                  return (
                    <li
                      key={t.id}
                      className={`teams__team ${isActive ? 'teams__team--selected' : ''}`}
                      onClick={this.selectTeam}
                      data-id={t.id}
                    >
                      {t.name}
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </Section>
        {
          selectedTeam ?
            <Section className="teams">
              <Header
                l10nId="teams-section-manage-roles-title"
                $team={selectedTeam.name}
                title="Manage roles">
                <Button clickHandler={this.unselectTeam} className="close-button">
                  <Icon name="close" />
                </Button>
              </Header>
              <div className="section__content">
                <ul className="teams__rolesList">
                  {
                    selectedTeam.roles.map(r => (
                      <li key={r.id} className="teams__role">
                        <RoleManager role={r} onUpdate={this.fetchTeams} onDelete={this.fetchTeams} />
                      </li>
                    ))
                  }
                </ul>
                <AddRole team={selectedTeam} onSuccess={this.fetchTeams} />
              </div>
            </Section>
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(Teams)
