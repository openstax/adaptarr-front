import * as React from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'

import axios from 'src/config/axios'
import store from 'src/store'
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
  user: {
    user: types.User
  }
  booksMap: {
    booksMap: types.BooksMap
  }
  modules: {
    modulesMap: types.ModulesMap
    assignedToMe: types.ModuleShortInfo[]
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
    drafts: types.DraftShortInfo[],
    showDeleteDraftDialog: boolean,
    targetDraftId: string | null,
  } = {
    isLoading: true,
    drafts: [],
    showDeleteDraftDialog: false,
    targetDraftId: null,
  }

  private showDeleteDraftDialog = (targetDraftId: string) => {
    this.setState({ showDeleteDraftDialog: true, targetDraftId })
  }

  private closeDeleteDraftDialog () {
    this.setState({ showDeleteDraftDialog: false, targetDraftId: null })
  }

  private deleteDraft () {
    const targetDraftId = this.state.targetDraftId

    if (!targetDraftId) return

    axios.delete(`drafts/${targetDraftId}`)
      .then(() => {
        this.fetchDrafts()
        store.dispatch(addAlert('success', 'Draft was deleted successfully.'))
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })

    this.closeDeleteDraftDialog()
  }

  private createDraft (targetDraftId: string) {
    if (!targetDraftId) return

    axios.post(`modules/${targetDraftId}`)
      .then(() => {
        store.dispatch(addAlert('success', 'Draft was created successfully.'))
        window.location.pathname = `/drafts/${targetDraftId}`
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  private listOfDrafts (arr: types.DraftShortInfo[]) {   
    return arr.map((draft: types.DraftShortInfo) => {
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
              clickHandler={() => this.showDeleteDraftDialog(draft.module)}
            >
              <Trans i18nKey="Buttons.delete" />
            </Button>
          </span>
        </li>
      )
    })
  }

  private listOfAssigned (mods: types.ModuleShortInfo[]) {
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
                  clickHandler={() => this.createDraft(mod.id)}
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
    axios.get('drafts')
      .then(res => {
        this.setState({ isLoading: false, drafts: res.data })
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
              title={`Are you sure you want to delete this draft?`} 
              onClose={() => this.closeDeleteDraftDialog()}
            >
              <Button color="red" clickHandler={() => this.deleteDraft()}>
                <Trans i18nKey="Buttons.delete" />
              </Button>
              <Button clickHandler={() => this.closeDeleteDraftDialog()}>
                <Trans i18nKey="Buttons.cancel" />
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
