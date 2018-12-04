import * as React from 'react'
import { connect } from 'react-redux'

import Header from '../../../components/Header'
import Loader from '../../../components/Loader'

import * as dashboardActions from '../../../store/actions/Dashboard'
import * as types from '../../../store/types'
import { State } from '../../../store/reducers/index'

type Props = {
  dashboard: {
    dashboard: types.Dashboard
  }
  booksMap: {
    booksMap: types.BooksMap
  }
  modulesMap: {
    modulesMap: types.ModulesMap
  }
  fetchDashboard: () => void
}

export const mapStateToProps = ({ dashboard, booksMap, modulesMap }: State) => {
  return {
    dashboard,
    booksMap,
    modulesMap,
  }
}

export const mapDispatchToProps = (dispatch: dashboardActions.FetchDashboard) => {
  return {
    fetchDashboard: () => dispatch(dashboardActions.fetchDashboard()),
  }
}

class Dashboard extends React.Component<Props, any, any> {

  private booksMap = this.props.booksMap.booksMap
  private modulesMap = this.props.modulesMap.modulesMap
  
  private isLoading = this.props.dashboard.dashboard.isLoading
  private drafts = this.props.dashboard.dashboard.drafts
  private assigned = this.props.dashboard.dashboard.assigned

  listOfDrafts (arr: types.DashboardDraft[]) {
    if (arr.length > 0) {
      return (
        <ul className="list list--drafts">
          {
            arr.map(draftId => {
              const currModule = this.modulesMap.get(draftId)
              const title = currModule ? currModule.title : 'undefined'
              
              return <li key={draftId} className="list__item">{title}</li>
            })
          }
        </ul>
      )
    } else {
      return 'You don\'t have any drafts.'
    }
  }

  listOfAssigned (arr: types.DashboardAssignedModule[]) {
    if (arr.length > 0) {
      return (
        <ul className="list list--assigned">
          {
            arr.map(el => {
              const currModule = this.modulesMap.get(el.id)
              const title = currModule ? currModule.title : 'undefined'

              return <li key={el.id} className="list__item">{title}</li>
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
        <div className="section__content">
          <Loader isLoading={this.isLoading}>
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
          </Loader>
        </div>
      </section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
