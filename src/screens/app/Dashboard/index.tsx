import * as React from 'react'
import { AxiosResponse } from 'axios'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'

import axios from 'src/config/axios'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

import * as types from 'src/store/types'
import { createDraft, deleteDraft } from 'src/store/actions/Drafts'
import { State } from 'src/store/reducers/index'

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
    const booksMap = this.props.booksMap.booksMap

    // Create {bookId: { title: string, id: number, drafts: []}}
    let booksWithDrafts = {}
    arr.forEach(draftId => {
      let currentModule = modulesMap.get(draftId)
      let currentBook = currentModule ? booksMap.get(currentModule.book) : null
      
      if (currentBook) {
        if (booksWithDrafts[currentBook.id]) {
          booksWithDrafts[currentBook.id].drafts.push(currentModule)
        } else {
          booksWithDrafts[currentBook.id] = {
            ...currentBook,
            drafts: [currentModule]
          }
        }
      } else {
        console.log(`Couldn't find book for draft with id: ${draftId}`)
      }
    })

    if (Object.keys(booksWithDrafts).length > 0) {
      return (
        <ul className="list">
          {
            Object.keys(booksWithDrafts).map(key => {
              const el: {id: string, title: string, drafts: []} = booksWithDrafts[key]
              
              return (
                <li key={el.id} className="list__item">
                  <span className="list__title bold">{el.title}</span>
                  <span className="list__button">
                    <Button
                      size="small"
                      to={`/books/${el.id}`}
                    >
                      <Trans i18nKey="Buttons.viewBook" />
                    </Button>
                  </span>
                  <ul className="list">
                    {
                      el.drafts.map((draft: {id: string, title: string}) => {
                        return <li key={draft.id} className="list__item">
                          <span className="list__title">
                            {draft.title}
                          </span>
                          <span className="list__buttons">
                            <Button 
                              size="small" 
                              to={`/modules/${draft.id}`}
                            >
                              <Trans i18nKey="Buttons.viewDraft" />
                            </Button>
                            <Button 
                              color="red" 
                              size="small" 
                              clickHandler={() => this.deleteDraft(draft.id)}
                            >
                              <Trans i18nKey="Buttons.delete" />
                            </Button>
                          </span>
                        </li>
                      })
                    }
                  </ul>
                </li>
              )
            })
          }
        </ul>
      )
    }

    return (
      <span>
        <Trans i18nKey="Dashboard.noDraftsFound" />
      </span>
    )
  }

  private listOfAssigned (arr: types.DashboardAssignedModule[]) {
    const user = this.props.user.user
    const modulesMap = this.props.modulesMap.modulesMap
    const booksMap = this.props.booksMap.booksMap

    // Create {bookId: { title: string, id: number, modules: []}}
    let booksWithModules = {}
    arr.forEach(el => {
      const moduleId = el.id
      let currentModule = modulesMap.get(moduleId)
      let currentBook = currentModule ? booksMap.get(currentModule.book) : null
      
      if (currentBook) {
        if (booksWithModules[currentBook.id]) {
          booksWithModules[currentBook.id].modules.push(currentModule)
        } else {
          booksWithModules[currentBook.id] = {
            ...currentBook,
            modules: [currentModule]
          }
        }
      } else {
        console.log(`Couldn't find book for draft with id: ${moduleId}`)
      }
    })

    if (Object.keys(booksWithModules).length > 0) {
      return (
        <ul className="list">
          {
            Object.keys(booksWithModules).map(key => {
              const el: {id: string, title: string, modules: []} = booksWithModules[key]
              
              return (
                <li key={el.id} className="list__item">
                  <span className="list__title bold">{el.title}</span>
                  <span className="list__button">
                    <Button
                      size="small"
                      to={`/books/${el.id}`}
                    >
                      <Trans i18nKey="Buttons.viewBook" />
                    </Button>
                  </span>
                  <ul className="list">
                    {
                      el.modules.map((mod: {id: string, title: string, assignee: number}) => {
                        const isUserAssigned = mod.assignee === user.id ? true : false

                        return <li key={mod.id} className="list__item">
                          <span className="list__title">
                            {mod.title}
                          </span>
                          <span className="list__buttons">
                            {
                              isUserAssigned ?
                                <Button 
                                  size="small"
                                  to={`/modules/${mod.id}`}
                                >
                                  <Trans i18nKey="Buttons.viewDraft" />
                                </Button>
                              :
                                <Button 
                                  color="green" 
                                  size="small" 
                                  clickHandler={() => this.createDraft(mod.id)}
                                >
                                  <Trans i18nKey="Buttons.newDraft" />
                                </Button>
                            }
                          </span>
                        </li>
                      })
                    }
                  </ul>
                </li>
              )
            })
          }
        </ul>
      )
    }

    return (
      <span>
        <Trans i18nKey="Dashboard.noAssigned" />
      </span>
    )
  }

  private fetchDashboard = () => {
    axios.get('dashboard')
      .then((res: AxiosResponse) => {
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
      <Section>
        <Header i18nKey="Dashboard.title" />
        {
          this.state.showDeleteDraftDialog ?
            <Dialog 
              title={`Do you want to delete draft ${draftToDelete ? draftToDelete.title : 'undefined'}?`} 
              onClose={() => this.closeDeleteDraftDialog()}
            >
              <Button color="red" clickHandler={() => this.deleteDraftPermamently()}>
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
          !isLoading ?
            <div className="section__content">
              <div className="section__half">
                <h3 className="section__heading">
                  <Trans i18nKey="Dashboard.yourDrafts" />
                </h3>
                {
                  this.listOfDrafts(drafts)
                }
              </div>
              <div className="section__half">
                <h3 className="section__heading">
                  <Trans i18nKey="Dashboard.assignedToYou" />
                </h3>
                {
                  this.listOfAssigned(assigned)
                }
              </div>
            </div>
          :
            <Spinner/>
        }
      </Section>
    )
  }
}

export default connect(mapStateToProps)(Dashboard)
