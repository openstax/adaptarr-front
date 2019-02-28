import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'
import { History } from 'history'

import store from 'src/store'
import * as api from 'src/api'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import DraftsList from 'src/components/DraftsList'
import AssignedToMe from 'src/components/AssignedToMe'
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
        store.dispatch(addAlert('success', 'dashboard-delete-draft-alert-success'))
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })

    this.closeDeleteDraftDialog()
  }

  private createDraft = (mod: api.Module) => {
    if (!mod) return

    mod.createDraft()
      .then(() => {
        store.dispatch(addAlert('success', 'dashboard-create-draft-alert-success'))
        this.props.history.push(`/drafts/${mod.id}`)
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
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
    const { drafts, isLoading, targetDraft } = this.state

    return (
      <Section>
        <Header l10nId="dashboard-view-title" title="Dashboard" />
        {
          this.state.showDeleteDraftDialog ?
            <Dialog
              title="dashboard-delete-draft-dialog-title"
              l20nArgs={{ title: targetDraft!.title }}
              onClose={this.closeDeleteDraftDialog}
            >
              <Button color="red" clickHandler={this.deleteDraft}>
                <Localized id="dashboard-delete-draft-confirm">
                  Delete
                </Localized>
              </Button>
              <Button clickHandler={this.closeDeleteDraftDialog}>
                <Localized id="dashboard-delete-draft-cancel">
                  Cancel
                </Localized>
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
                <Localized id="dashboard-section-drafts">
                  Your drafts:
                </Localized>
              </h3>
              <DraftsList
                drafts={drafts}
                onDraftDeleteClick={this.showDeleteDraftDialog}
              />
            </div>
            <div className="section__half">
              <h3 className="section__heading">
                <Localized id="dashboard-section-assigned">
                  Assigned to you:
                </Localized>
              </h3>
              <AssignedToMe
                drafts={drafts}
                onCreateDraft={this.createDraft}
              />
            </div>
          </div>
        }
      </Section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
