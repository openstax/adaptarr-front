import * as React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { GetString, withLocalization } from 'fluent-react/compat'

import User from 'src/api/user'
import Team, { TeamPermission } from 'src/api/team'

import { State } from 'src/store/reducers'
import { TeamsMap } from 'src/store/types'

import { useIsInSuperMode } from 'src/hooks'

interface TeamSelectorProps {
  // Filter user teams against specific permission.
  permission?: TeamPermission
  isDisabled?: boolean
  team?: Team
  teams: TeamsMap
  user: User
  getString: GetString
  onChange: (team: Team) => void
}

const mapStateToProps = ({ app: { teams }, user: { user } }: State) => ({
  teams,
  user,
})

const TeamSelector = (props: TeamSelectorProps) => {
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null)
  const isInSuperMode = useIsInSuperMode(props.user)

  const handleChange = ({ value }: { value: Team, label: string }) => {
    setSelectedTeam(value)
    props.onChange(value)
  }

  const options = (): { value: Team, label: string }[] => {
    const { permission, teams, user } = props

    // If teams.size === 0 probably means that team list is still fetching.
    if (teams.size === 0) return []

    let options: { value: Team, label: string }[] = []
    if (isInSuperMode) {
      options = Array.from(teams.values()).map(t => ({ value: t, label: t.name }))
      return options
    }

    if (permission) {
      options = user.teams.filter(t => {
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

  React.useEffect(() => {
    if (props.team) {
      setSelectedTeam(props.team)
    }
  }, [props.team])

  const selectOptions = options()

  return (
    <Select
      className="react-select team-selector"
      isDisabled={props.isDisabled}
      placeholder={props.getString('team-selector-placeholder')}
      value={selectedTeam ? { value: selectedTeam, label: selectedTeam.name } : null}
      options={selectOptions}
      onChange={handleChange}
    />
  )
}

export default connect(mapStateToProps)(withLocalization(TeamSelector))
