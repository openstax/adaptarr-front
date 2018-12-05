import * as React from 'react'
import { connect } from 'react-redux'

import Header from '../../../components/Header'
import Spinner from '../../../components/Spinner'
import Button from '../../../components/ui/Button'

import * as dashboardActions from '../../../store/actions/Dashboard'
import * as types from '../../../store/types'
import { State } from '../../../store/reducers/index'

type Props = {
  dashboard: {
    dashboard: types.Dashboard
  }
  user: {
    user: types.User
  }
  booksMap: {
    booksMap: types.BooksMap
  }
  modulesMap: {
    modulesMap: types.ModulesMap
  }
  fetchDashboard: () => void
}

export const mapStateToProps = ({ dashboard, user, booksMap, modulesMap }: State) => {
  return {
    dashboard,
    user,
    booksMap,
    modulesMap,
  }
}

export const mapDispatchToProps = (dispatch: dashboardActions.FetchDashboard) => {
  return {
    fetchDashboard: () => dispatch(dashboardActions.fetchDashboard()),
  }
}

class Dashboard extends React.Component<Props> {

  private user = this.props.user.user
  private booksMap = this.props.booksMap.booksMap
  private modulesMap = this.props.modulesMap.modulesMap
  
  private isLoading = this.props.dashboard.dashboard.isLoading
  private drafts = this.props.dashboard.dashboard.drafts
  private assigned = this.props.dashboard.dashboard.assigned

  private deleteDraft (id: string) {
    console.log('deleteDraft', id)
  }

  private createDraft (moduleId: string) {
    console.log('createDraft', moduleId)
  }

  private listOfDrafts (arr: types.DashboardDraft[]) {
    if (arr.length > 0) {
      return (
        <ul className="list list--drafts">
          {
            arr.map(draftId => {
              const currModule = this.modulesMap.get(draftId)
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
    console.log('listOfAssigned')
    if (arr.length > 0) {
      return (
        <ul className="list list--assigned">
          {
            arr.map(el => {
              const currModule = this.modulesMap.get(el.id)
              const title = currModule ? currModule.title : 'undefined'
              
              let isUserAssigned = false
              if (currModule && currModule.assignee === this.user.id) {
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

  componentDidMount () {
    this.props.fetchDashboard()
  }

  public render() {
    return (
      <section className="section--wrapper">
        <Header title={"Dashboard"} />          
        {
          !this.isLoading ?
            <div className="section__content">
              <div className="section__half">
                <h3 className="section__heading">Your drafts:</h3>
                {
                  this.listOfDrafts(this.drafts)
                }
              </div>
              <div className="section__half">
                <h3 className="section__heading">Assigned to you:</h3>
                {
                  this.listOfAssigned(this.assigned)
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
