import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { User } from 'src/api'

import store from 'src/store'
import { setSelectedTeams } from 'src/store/actions/app'
import { State } from 'src/store/reducers'
import { TeamsMap } from 'src/store/types'

import SelectList from 'src/components/ui/SelectList'
import Icon from 'src/components/ui/Icon'

import './index.css'

interface TeamSwitcherProps {
  user: User
  selectedTeams: number[]
  teams: TeamsMap
}

const mapStateToProps = ({ user: { user }, app: { selectedTeams, teams } }: State) => ({
  user,
  selectedTeams,
  teams,
})

class TeamSwitcher extends React.Component<TeamSwitcherProps> {
  private onSelectListChange = (selected: Set<number>) => {
    const teamsIds = [...selected]
    store.dispatch(setSelectedTeams(teamsIds))
  }

  private toggleList = () => {
    const isListOpen = this.selectList.current!.state.isListOpen
    if (isListOpen) {
      this.selectList.current!.close()
    } else {
      this.selectList.current!.open()
    }
  }

  componentDidMount() {
    const { user } = this.props

    const selTeamsFromLS = localStorage.getItem('selectedTeams')
    // Filter value saved in localStorage since it can change when user will log
    // to another account.
    let selectedTeams: number[] = JSON.parse(selTeamsFromLS || '[]')
      .filter((tId: number) => user.teams.find(t => t.id === tId || user.is_super))

    if (selectedTeams.length === 0 && user.teams.length > 0) {
      selectedTeams = user.teams.map(t => t.id)
    }

    store.dispatch(setSelectedTeams(selectedTeams))

    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('click', this.clickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('click', this.clickOutside)
  }

  selectList = React.createRef<SelectList>()

  teamSwitcher = React.createRef<HTMLDivElement>()

  public render() {
    const { user, selectedTeams, teams } = this.props

    if (user.teams.length === 0) return null

    return (
      <div ref={this.teamSwitcher} className="team-switcher">
        <span className="team-switcher__box" onClick={this.toggleList}>
          <span className="team-switcher__value">
            <span className="team-switcher__name">
              {
                selectedTeams.length && teams.has(selectedTeams[0]) ?
                  teams.get(selectedTeams[0])!.name
                  :
                  <Localized id="team-switcher-select-placeholder">
                    Select teams
                  </Localized>
              }
            </span>
            {
              selectedTeams.length > 1 ?
                <span className="team-switcher__more">
                  + {selectedTeams.length - 1}
                </span>
                : null
            }
          </span>
          <span className="team-switcher__trigger">
            <Icon size="small" name="arrow-down" />
          </span>
        </span>
        <SelectList
          ref={this.selectList}
          showSelectAllOption={teams.size > 1}
          isListOpen={false}
          options={Array.from(teams.values())}
          onChange={this.onSelectListChange}
          formatOption={formatSelectOption}
          selected={selectedTeams}
          closeAfterSelect={false}
        />
      </div>
    )
  }

  private onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' && this.selectList.current) {
      if (this.selectList.current.state.isListOpen) {
        this.selectList.current!.close()
      }
    }
  }

  private clickOutside = (ev: MouseEvent) => {
    if (
      this.teamSwitcher.current &&
      !this.teamSwitcher.current.contains(ev.target as HTMLElement)
    ) {
      if (this.selectList.current!.state.isListOpen) {
        this.selectList.current!.close()
      }
    }
  }
}

export default connect(mapStateToProps)(TeamSwitcher)

function formatSelectOption(option: any): JSX.Element {
  return option.name
}
