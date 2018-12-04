import * as React from 'react'
import { connect } from 'react-redux'

import Header from '../../../components/Header'

import * as dashboardActions from '../../../store/actions/Dashboard'
import { State } from '../../../store/reducers/index'

type Props = {
  dashboard: {}
  fetchDashboard: () => void
}

export const mapStateToProps = ({ dashboard }: State) => {
  return {
    dashboard,
  }
}

export const mapDispatchToProps = (dispatch: dashboardActions.FetchDashboard) => {
  return {
    fetchDashboard: () => dispatch(dashboardActions.fetchDashboard()),
  }
}

class Dashboard extends React.Component<Props> {
  
  componentDidMount () {
    this.props.fetchDashboard()
  }

  public render() {
    return (
      <section className="section--wrapper">
        <Header title={"Dashboard"} />
        <div className="section__content">
          Dashboard data: { JSON.stringify(this.props.dashboard) }
        </div>
      </section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
