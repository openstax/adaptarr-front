import * as React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { History } from 'history'

import i18n from 'src/i18n'
import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
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
}

const mapStateToProps = ({ team }: State) => {
  return {
    team,
  }
}

class Module extends React.Component<Props> {
  
  state: {
    isLoading: boolean
    mod: api.Module | undefined
    isDraftExisting: boolean
    error?: string
  } = {
    isLoading: true,
    mod: undefined,
    isDraftExisting: false,
  }

  private fetchModuleInfo = () => {
    api.Module.load(this.props.match.params.id)
      .then(mod => {
        this.setState({ isLoading: false, mod, error: '' })
      })
      .catch(() => {
        this.props.history.push('/404')
      })
  }

  private isDraftExisting = () => {
    api.Draft.load(this.props.match.params.id)
      .then(() => {
        this.setState({ isDraftExisting: true })
      })
      .catch(() => {
        this.setState({ isDraftExisting: false })
      })
  }

  private createDraft = () => {
    const { mod } = this.state

    if (!mod) return

    mod.createDraft()
      .then(draft => {
        store.dispatch(addAlert('success', i18n.t("Draft.createDraftSuccess")))
        this.props.history.push(`/drafts/${draft.module}`)
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchModuleInfo()
      this.isDraftExisting()
    }
  }

  componentDidMount = () => {
    this.fetchModuleInfo()
    this.isDraftExisting()
  }

  public render() {
    const { isLoading, mod, isDraftExisting, error } = this.state
    const teamMap = this.props.team.teamMap

    return (
      <Section>
        <Header title={mod ? mod.title : i18n.t("Unknown.module")}>
          {
            mod ?
              <React.Fragment>
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
              </React.Fragment>
            : null
          }
        </Header>
        <div className="section__content">
          {
            isLoading ?
              <Spinner/>
            :
              <React.Fragment>
                {
                  mod ?
                    <ModulePreview moduleId={mod.id}/>
                  : error
                }
              </React.Fragment>
          }
        </div>
      </Section>
    )
  }
}

export default connect(mapStateToProps)(Module)
