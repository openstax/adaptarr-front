import * as React from 'react'
import { AxiosResponse } from 'axios'
import { connect } from 'react-redux'

import axios from '../../../config/axios'

import Header from '../../../components/Header'
import Spinner from '../../../components/Spinner'
import Button from '../../../components/ui/Button'
import Dialog from '../../../components/ui/Dialog'

import * as types from '../../../store/types'
import { createDraft, deleteDraft } from '../../../store/actions/Drafts'
import { State } from '../../../store/reducers/index'

type Props = {
  user: {
    user: types.User
  }
  booksMap: {
    booksMap: types.BooksMap
  }
  modulesMap: {
    modulesMap: types.ModulesMap
  }
}

export const mapStateToProps = ({ user, booksMap, modulesMap }: State) => {
  return {
    user,
    booksMap,
    modulesMap,
  }
}

class Dashboard extends React.Component<Props> {

  public state: {
    isLoading: boolean,
    drafts: types.DashboardDraft[],
    assigned: types.DashboardAssignedModule[],
    showDeleteDraftDialog: boolean, 
    draftToDelete?: types.ModuleShortInfo
  } = {
    isLoading: true,
    drafts: [],
    assigned: [],
    showDeleteDraftDialog: false,
  }

  private deleteDraft (id: string) {
    const modulesMap = this.props.modulesMap.modulesMap
    const draftToDelete = modulesMap.get(id)
    console.log('draftToDelete', draftToDelete)
    this.setState({showDeleteDraftDialog: true, draftToDelete})
  }

  private deleteDraftPermamently () {
    console.log('deleteDraft')
    if (this.state.draftToDelete) {
      deleteDraft(this.state.draftToDelete.id)
    } else {
      console.log('There is no draft with given id.')
    }    
  }

  private closeDeleteDraftDialog () {
    this.setState({showDeleteDraftDialog: false, draftToDelete: {}})
  }

  private createDraft (moduleId: string) {
    console.log('createDraft', moduleId)
    createDraft(moduleId)
  }

  private listOfDrafts (arr: types.DashboardDraft[]) {
    const modulesMap = this.props.modulesMap.modulesMap

    if (arr.length > 0) {
      return (
        <ul className="list list--drafts">
          {
            arr.map(draftId => {
              const currModule = modulesMap.get(draftId)
              const title = currModule ? currModule.title : 'undefined'

              return <li key={draftId} className="list__item">
                  <span className="list__title">
                    {title}
                  </span>
                  <span className="list__buttons">
                    <Button 
                      color="green" 
                      size="small" 
                      to={`/modules/${draftId}`}
                    >
                      View draft
                    </Button>
                    <Button 
                      color="red" 
                      size="small" 
                      clickHandler={() => this.deleteDraft(draftId)}
                    >
                      Delete
                    </Button>
                  </span>
                </li>
            })
          }
        </ul>
      )
    } else {
      return 'You don\'t have any drafts.'
    }
  }

  private listOfAssigned (arr: types.DashboardAssignedModule[]) {
    const modulesMap = this.props.modulesMap.modulesMap
    const user = this.props.user.user

    if (arr.length > 0) {
      return (
        <ul className="list list--assigned">
          {
            arr.map(el => {
              const currModule = modulesMap.get(el.id)
              const title = currModule ? currModule.title : 'undefined'
              
              let isUserAssigned = false
              if (currModule && currModule.assignee === user.id) {
                isUserAssigned = true
              }

              return <li key={el.id} className="list__item">
                  <span className="list__title">
                    {title}
                  </span>
                  <span className="list__buttons">
                    {
                      isUserAssigned ?
                        <Button 
                          size="small"
                          to={`/modules/${el.id}`}
                        >
                          View draft
                        </Button>
                      :
                        <Button 
                          color="green" 
                          size="small" 
                          clickHandler={() => this.createDraft(el.id)}
                        >
                          New draft
                        </Button>
                    }
                  </span>
                </li>
            })
          }
        </ul>
      )
    } else {
      return 'You are not assigned to any module.'
    }
  }

  private fetchDashboard = () => {
    axios.get('dashboard')
      .then((res: AxiosResponse) => {
        console.log('done')
        this.setState({
          isLoading: false,
          assigned: res.data.assigned,
          drafts: res.data.drafts,
        })
      })
      .catch((e: ErrorEvent) => {
        console.log(e.message)
        this.setState({isLoading: false})
      })
  }

  componentDidMount () {
    this.fetchDashboard()
  }

  public render() {
    const { isLoading, drafts, assigned, draftToDelete } = this.state

    return (
      <section className="section--wrapper">
        <Header title={"Dashboard"} />
        {
          this.state.showDeleteDraftDialog ?
            <Dialog onClose={() => this.closeDeleteDraftDialog()}>
              <h3>
                Do you want to delete draft {draftToDelete ? draftToDelete.title : 'undefined'}?
              </h3>
              <Button color="red" clickHandler={() => this.deleteDraftPermamently()}>
                Delete
              </Button>
              <Button clickHandler={() => this.closeDeleteDraftDialog()}>
                Cancel
              </Button>
            </Dialog>
          :
            null
        }
        {
          !isLoading ?
            <div className="section__content">
              <div className="section__half">
                <h3 className="section__heading">Your drafts:</h3>
                {
                  this.listOfDrafts(drafts)
                }
              </div>
              <div className="section__half">
                <h3 className="section__heading">Assigned to you:</h3>
                {
                  this.listOfAssigned(assigned)
                }
              </div>
            </div>
          :
            <Spinner/>
        }
      </section>
    )
  }
}

export default connect(mapStateToProps)(Dashboard)
