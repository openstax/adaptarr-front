import * as React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { match } from 'react-router'
import { History } from 'history'

import i18n from 'src/i18n'
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
        store.dispatch(addAlert('success', i18n.t("Draft.createDraftSuccess")))
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
        <Header title={mod ? mod.title : i18n.t("Unknown.module")}>
          {
            mod.assignee ?
              <div className="module__assignee">
                <span>{i18n.t("Module.assignee")}</span>
                <Avatar size="small" user={teamMap.get(mod.assignee)}/>
              </div>
            : null
          }
          <UserUI userId={mod.assignee}>
            {
              isDraftExisting ?
                <Button to={`/drafts/${mod.id}`}>
                  <Trans i18nKey="Buttons.viewDraft"/>
                </Button>
              :
              <Button
                color="green"
                clickHandler={this.createDraft}
              >
                <Trans i18nKey="Buttons.newDraft"/>
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
