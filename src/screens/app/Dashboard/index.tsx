import * as React from 'react'
import { connect } from 'react-redux'

import Header from '../../../components/Header'

import * as userActions from '../../../store/actions/User'
import * as dashboardActions from '../../../store/actions/Dashboard'
import { State } from '../../../store/reducers/index'

type Props = {
  user: {}
  dashboard: {}
  fetchUser: () => void
  fetchDashboard: () => void
}

export function mapStateToProps ({ user, dashboard }: State) {
  return {
    user,
    dashboard,
  }
}

export function mapDispatchToProps (dispatch: userActions.FetchUser | dashboardActions.FetchDashboard) {
  return {
    fetchUser: () => dispatch(userActions.fetchUser()),
    fetchDashboard: () => dispatch(dashboardActions.fetchDashboard()),
  }
}

class Dashboard extends React.Component<Props> {
  
  componentDidMount () {
    this.props.fetchUser()
    this.props.fetchDashboard()
  }

  public render() {
    return (
      <section className="section--wrapper">
        <Header title={"Dashboard"} />
        <div className="section__content">
          User data: {JSON.stringify(this.props.user)}
          Dashboard data: { JSON.stringify(this.props.dashboard) }
        </div>
      </section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
