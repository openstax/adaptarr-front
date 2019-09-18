import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'

import User from 'src/api/user'
import Team, { TeamPermission } from 'src/api/team'

import { State } from 'src/store/reducers'

export type TeamSelectorProps = {
  // Filter user teams against specific permission.
  permission?: TeamPermission
  isDisabled?: boolean
  team?: Team
  teams: Map<number, Team>
  user: User
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
    let options: { value: Team, label: string }[] = []
    if (permission) {
      options = user.teams.filter(t => {
        if (user.is_super) return true
        if (!t.role || !t.role.permissions || !t.role.permissions.includes(permission)) return false
        return true
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
        value={selectedTeam ? { value: selectedTeam, label: selectedTeam.name } : null}
        options={options}
        onChange={this.handleChange}
      />
    )
  }
}

export default connect(mapStateToProps)(TeamSelector)
