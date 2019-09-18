import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'
import { match } from 'react-router'
import { History } from 'history'

import { Team, TeamMember } from 'src/api'

import store from 'src/store'
import { setTeams } from 'src/store/actions/app'
import { addAlert } from 'src/store/actions/Alerts'
import { State } from 'src/store/reducers'
import { UsersMap } from 'src/store/types'
import { TeamsMap } from 'src/store/types'

import AddTeam from './components/AddTeam'
import RoleManager from './components/RoleManager'
import AddRole from './components/AddRole'
import MembersManager from './components/MembersManager'
import Header from 'src/components/Header'
import Section from 'src/components/Section'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import './index.css'

export type TeamsProps = {
  teams: TeamsMap
  users: UsersMap
  match: match<{ id: string, tab: string }>
  history: History
}

const mapStateToProps = ({ app: { teams }, user: { users } }: State) => {
  return {
    teams,
    users,
  }
}

export type TeamsState = {
  isLoading: boolean
  selectedTeam: Team | undefined
  members: TeamMember[]
  activeTab: 'roles' | 'members'
}

class Teams extends React.Component<TeamsProps> {
  state: TeamsState = {
    isLoading: true,
    selectedTeam: undefined,
    members: [],
    activeTab: 'roles',
  }

  private onTeamClick = (ev: React.MouseEvent) => {
    const teamId = Number((ev.target as HTMLLIElement).dataset.id)
    if (this.state.selectedTeam && this.state.selectedTeam.id === teamId) {
      this.unselectTeam()
    } else {
      this.selectTeam(teamId)
    }
  }

  private selectTeam = async (id: number, tab: string = 'roles') => {
    const team = this.props.teams.get(id)!
    if (
      !this.state.selectedTeam ||
      this.state.selectedTeam.id !== team.id ||
      this.state.activeTab !== tab
    ) {
      const members = await team.members()
      this.setState({ selectedTeam: team, members, activeTab: tab })
      this.props.history.push(`/teams/${id}/${tab}`)
    }
  }

  private unselectTeam = () => {
    this.setState({ selectedTeam: undefined, members: [] })
  }

  private activateRolesTab = () => {
    if (this.state.activeTab !== 'roles') {
      this.setState({ activeTab: 'roles' })
      this.props.history.push(`/teams/${this.props.match.params.id}/roles`)
    }
  }

  private activateMembersTab = () => {
    if (this.state.activeTab !== 'members') {
      this.setState({ activeTab: 'members' })
      this.props.history.push(`/teams/${this.props.match.params.id}/members`)
    }
  }

  private fetchRoles = () => {
    this.state.selectedTeam!.getRoles()
      .then(() => this.forceUpdate())
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
    return true
  }

  componentDidUpdate(prevProps: TeamsProps) {
    const { id: prevId, tab: prevTab } = prevProps.match.params
    const { id, tab } = this.props.match.params
    if (prevId !== id) {
      this.selectTeam(Number(id), tab)
    } else {
      if (prevTab !== tab && tab === 'roles') {
        this.activateRolesTab()
      } else if (prevTab !== tab && tab === 'members') {
        this.activateMembersTab()
      }
    }
  }

  async componentDidMount() {
    await this.fetchTeams()
      .then(() => {
        const { id, tab } = this.props.match.params
        if (id) {
          this.selectTeam(Number(id), tab)
        } else {
          if (tab && tab === 'roles') {
            this.activateRolesTab()
          } else if (tab && tab === 'members') {
            this.activateMembersTab()
          }
        }
      })
  }

  public render() {
    const { isLoading, selectedTeam, activeTab } = this.state
    const { teams } = this.props

    if (isLoading) return <Spinner />

    return (
      <div className={`container ${selectedTeam ? 'container--splitted' : ''}`}>
        <Section className="teams">
          <Header l10nId="teams-section-manage-teams-title" title="Manage teams">
            {
              selectedTeam ?
                <div className="tabs-controls">
                  <Button
                    withBorder={true}
                    className={activeTab === 'roles' ? 'active' : ''}
                    clickHandler={this.activateRolesTab}>
                    <Localized id="teams-tab-roles">
                      Roles
                    </Localized>
                  </Button>
                  <Button
                    withBorder={true}
                    className={activeTab === 'members' ? 'active' : ''}
                    clickHandler={this.activateMembersTab}>
                    <Localized id="teams-tab-members">
                      Team members
                    </Localized>
                  </Button>
                </div>
              : null
            }
          </Header>
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
                      onClick={this.onTeamClick}
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
            activeTab === 'roles' ?
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
                          <RoleManager role={r} onUpdate={this.fetchRoles} onDelete={this.fetchRoles} />
                        </li>
                      ))
                    }
                  </ul>
                  <AddRole team={selectedTeam} onSuccess={this.fetchRoles} />
                </div>
              </Section>
            :
              <Section className="teams">
                <Header
                  l10nId="teams-section-manage-members-title"
                  $team={selectedTeam.name}
                  title="Manage members">
                  <Button clickHandler={this.unselectTeam} className="close-button">
                    <Icon name="close" />
                  </Button>
                </Header>
                <div className="section__content">
                  <MembersManager team={selectedTeam} />
                </div>
              </Section>
          : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(Teams)
