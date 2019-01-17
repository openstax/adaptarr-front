import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { History } from 'history'

import i18n from 'src/i18n'
import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import * as types from 'src/store/types'
import { FetchModulesAssignedToMe, fetchModulesAssignedToMe } from 'src/store/actions/Modules'
import { State } from 'src/store/reducers/index'

type Props = {
  history: History
  user: {
    user: api.User
  }
  booksMap: {
    booksMap: types.BooksMap
  }
  modules: {
    modulesMap: types.ModulesMap
    assignedToMe: api.Module[]
  }
  fetchModulesAssignedToMe: () => void
}

const mapStateToProps = ({ user, booksMap, modules }: State) => {
  return {
    user,
    booksMap,
    modules,
  }
}

const mapDispatchToProps = (dispatch: FetchModulesAssignedToMe) => {
  return {
    fetchModulesAssignedToMe: () => dispatch(fetchModulesAssignedToMe())
  }
}

class Dashboard extends React.Component<Props> {

  public state: {
    isLoading: boolean,
    drafts: api.Draft[],
    showDeleteDraftDialog: boolean,
    targetDraft: api.Draft | null,
  } = {
    isLoading: true,
    drafts: [],
    showDeleteDraftDialog: false,
    targetDraft: null,
  }

  private showDeleteDraftDialog = (targetDraft: api.Draft) => {
    this.setState({ showDeleteDraftDialog: true, targetDraft })
  }

  private closeDeleteDraftDialog = () => {
    this.setState({ showDeleteDraftDialog: false, targetDraftId: null })
  }

  private deleteDraft = () => {
    const { targetDraft } = this.state

    if (!targetDraft) return

    targetDraft.delete()
      .then(() => {
        this.fetchDrafts()
        store.dispatch(addAlert('success', i18n.t("Draft.deleteDraftSuccess")))
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })

    this.closeDeleteDraftDialog()
  }

  private createDraft = (of: api.Module) => {
    if (!of) return

    of.createDraft()
      .then(() => {
        store.dispatch(addAlert('success', i18n.t("Draft.createDraftSuccess")))
        this.props.history.push(`/drafts/${of.id}`)
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  private listOfDrafts = (arr: api.Draft[]) => {
    return arr.map((draft: api.Draft) => {
      return (
        <li key={draft.module} className="list__item">
          <span className="list__title">
            {draft.title}
          </span>
          <span className="list__buttons">
            <Button 
              to={`/drafts/${draft.module}`}
            >
              <Trans i18nKey="Buttons.viewDraft" />
            </Button>
            <Button
              color="red"
              clickHandler={() => this.showDeleteDraftDialog(draft)}
            >
              <Trans i18nKey="Buttons.delete" />
            </Button>
          </span>
        </li>
      )
    })
  }

  private listOfAssigned = (mods: api.Module[]) => {
    const drafts = this.state.drafts

    return mods.map(mod => {
      const isDraftCreated = drafts.some(draft => draft.module === mod.id)

      return (
        <li key={mod.id} className="list__item">
          <span className="list__title">
            {mod.title}
          </span>
          <span className="list__buttons">
            {
              isDraftCreated ?
                <Button 
                  to={`/modules/${mod.id}`}
                >
                  <Trans i18nKey="Buttons.viewDraft" />
                </Button>
              :
                <Button
                  color="green"
                  clickHandler={() => this.createDraft(mod)}
                >
                  <Trans i18nKey="Buttons.newDraft" />
                </Button>
            }
          </span>
        </li>
      )
    })
  }

  private fetchDrafts = () => {
    api.Draft.all()
      .then(drafts => {
        this.setState({ isLoading: false, drafts })
      })
      .catch(e => {
        this.setState({ isLoading: false })
        store.dispatch(addAlert('error', e.message))
      })
  }

  componentDidMount () {
    this.props.fetchModulesAssignedToMe()
    this.fetchDrafts()
  }

  public render() {
    const { drafts, isLoading } = this.state
    const { assignedToMe } = this.props.modules

    return (
      <Section>
        <Header i18nKey="Dashboard.title" />
        {
          this.state.showDeleteDraftDialog ?
            <Dialog 
              title={i18n.t("Draft.deleteDraftConfirmation")} 
              onClose={this.closeDeleteDraftDialog}
            >
              <Button color="red" clickHandler={this.deleteDraft}>
                <Trans i18nKey="Buttons.delete"/>
              </Button>
              <Button clickHandler={this.closeDeleteDraftDialog}>
                <Trans i18nKey="Buttons.cancel"/>
              </Button>
            </Dialog>
          :
            null
        }
        {
          isLoading ?
            <Spinner />
          :
          <div className="section__content">
            <div className="section__half">
              <h3 className="section__heading">
                <Trans i18nKey="Dashboard.yourDrafts" />
              </h3>
              {
                drafts.length > 0 ?
                  <ul className="list">
                    {
                      this.listOfDrafts(drafts)
                    }
                  </ul>
                :
                  <Trans i18nKey="Dashboard.noDraftsFound" />
              }
            </div>
            <div className="section__half">
              <h3 className="section__heading">
                <Trans i18nKey="Dashboard.assignedToYou" />
              </h3>
              {
                assignedToMe.length > 0 ?
                  <ul className="list">
                    {
                      this.listOfAssigned(assignedToMe)
                    }
                  </ul>
                :
                  <Trans i18nKey="Dashboard.noAssigned" />
              }
            </div>
          </div>
        }
      </Section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
