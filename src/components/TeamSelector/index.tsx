import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { withLocalization, GetString } from 'fluent-react/compat'

import User from 'src/api/user'
import Team, { TeamPermission } from 'src/api/team'

import { State } from 'src/store/reducers'
import { TeamsMap } from 'src/store/types'

export type TeamSelectorProps = {
  // Filter user teams against specific permission.
  permission?: TeamPermission
  isDisabled?: boolean
  team?: Team
  teams: TeamsMap
  user: User
  getString: GetString
  onChange: (team: Team) => void
}

const mapStateToProps = ({ app: { teams }, user: { user } }: State) => {
  return {
    teams,
    user,
  }
}

export type TeamSelectorState = {
  selectedTeam: Team | null
}

class TeamSelector extends React.Component<TeamSelectorProps> {
  state: TeamSelectorState = {
    selectedTeam: null,
  }

  private handleChange = ({ value }: { value: Team, label: string }) => {
    this.setState({ selectedTeam: value }, () => {
      this.props.onChange(value)
    })
  }

  private options = (): { value: Team, label: string }[] => {
    const { permission, teams, user } = this.props

    // If teams.size === 0 probably means that team list is still fetching.
    if (teams.size === 0) return []

    let options: { value: Team, label: string }[] = []
    if (permission) {
      options = user.teams.filter(t => {
        if (user.isInSuperMode) return true
        if (t.allPermissions.has(permission)) return true
        return false
      }).map(ut => {
        const team = teams.get(ut.id)!
        return { value: team, label: team.name }
      })
    } else {
      options = user.teams.map(ut => {
        const team = teams.get(ut.id)!
        return { value: team, label: team.name }
      })
    }
    return options
  }

  componentDidUpdate(prevProps: TeamSelectorProps) {
    if (
      typeof prevProps.team !== typeof this.props.team ||
      (prevProps.team && this.props.team && prevProps.team.id !== this.props.team.id)
    ) {
      this.setState({ selectedTeam: this.props.team })
    }
  }

  componentDidMount() {
    if (this.props.team) {
      this.setState({ selectedTeam: this.props.team })
    }
  }

  public render() {
    const { selectedTeam } = this.state
    const options = this.options()

    return (
      <Select
        className="react-select team-selector"
        isDisabled={this.props.isDisabled}
        placeholder={this.props.getString('team-selector-placeholder')}
        value={selectedTeam ? { value: selectedTeam, label: selectedTeam.name } : null}
        options={options}
        onChange={this.handleChange}
      />
    )
  }
}

export default connect(mapStateToProps)(withLocalization(TeamSelector))
