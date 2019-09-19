import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Team from 'src/api/team'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import LimitedUI from 'src/components/LimitedUI'
import Input from 'src/components/ui/Input'

import './index.css'

export type AddTeamProps = {
  onSuccess: (team: Team) => void
}

export type AddTeamState = {
  name: string
}

export default class AddTeam extends React.Component<AddTeamProps> {
  state: AddTeamState = {
    name: '',
  }

  private handleNameChange = (name: string) => {
    this.setState({ name })
  }

  private addTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (this.state.name.length === 0) return

    await Team.create(this.state.name)
      .then((r) => {
        this.props.onSuccess(r)
        store.dispatch(addAlert('success', 'teams-add-team-success', { name: this.state.name }))
      })
      .catch(() => {
        store.dispatch(addAlert('error', 'teams-add-team-error'))
      })

    this.setState({ name: '' })
  }

  public render() {
    return (
      <LimitedUI permissions="team:manage">
        <form className="add-team" onSubmit={this.addTeam}>
          <Input
            value={this.state.name}
            l10nId="teams-add-team-placeholder"
            onChange={this.handleNameChange}
          />
          <Localized id="teams-add-team" attrs={{ value: true }}>
            <input
              disabled={!this.state.name.length}
              type="submit"
              value="Add team"
            />
          </Localized>
        </form>
      </LimitedUI>
    )
  }
}
