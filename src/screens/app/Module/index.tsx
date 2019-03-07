import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'
import { match } from 'react-router'
import { History } from 'history'

import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import Header from 'src/components/Header'
import Load from 'src/components/Load'
import Section from 'src/components/Section'
import Spinner from 'src/components/Spinner'
import UserUI from 'src/components/UserUI'
import Button from 'src/components/ui/Button'
import Avatar from 'src/components/ui/Avatar'

import ModulePreview from 'src/containers/ModulePreview'

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
  mod: api.Module
  isDraftExisting: boolean
}

const mapStateToProps = ({ team }: State) => {
  return {
    team,
  }
}

async function loader({ match }: { match: match<{ id: string }> }) {
  const [module, draft] = await Promise.all([
    api.Module.load(match.params.id),
    api.Draft.load(match.params.id).catch(() => null)
  ])

  return {
    mod: module,
    isDraftExisting: draft !== null,
  }
}

class Module extends React.Component<Props> {
  private createDraft = () => {
    const { mod, history } = this.props

    mod.createDraft()
      .then(draft => {
        store.dispatch(addAlert('success', 'module-create-draft-alert-success'))
        history.push(`/drafts/${draft.module}`)
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  public render() {
    const { mod, isDraftExisting, team: { teamMap } } = this.props

    return (
      <Section>
        <Header l10nId="module-view-title" title={mod.title}>
          {
            mod.assignee ?
              <div className="module__assignee">
                <span><Localized id="module-assignee">Asignee:</Localized></span>
                <Avatar size="small" user={teamMap.get(mod.assignee)}/>
              </div>
            : null
          }
          <UserUI userId={mod.assignee}>
            {
              isDraftExisting ?
                <Button to={`/drafts/${mod.id}`}>
                  <Localized id="module-open-draft">
                    View draft
                  </Localized>
                </Button>
              :
              <Button
                color="green"
                clickHandler={this.createDraft}
              >
                <Localized id="module-create-draft">
                  New draft
                </Localized>
              </Button>
            }
          </UserUI>
        </Header>
        <div className="section__content">
          <ModulePreview moduleId={mod.id}/>
        </div>
      </Section>
    )
  }
}

export default Load(loader)(connect(mapStateToProps)(Module))
