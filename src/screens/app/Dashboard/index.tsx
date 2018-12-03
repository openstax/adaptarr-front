import * as React from 'react'
import { connect } from 'react-redux'

import Header from '../../../components/Header'

import * as actions from '../../../store/actions'
import { State } from '../../../store/reducers/index'

type Props = {
  dashboard: {}
  fetchDashboard: () => void
}

export function mapStateToProps ({ dashboard }: State) {
  return {
    dashboard,
  }
}

// TODO: Figure out why removing "any" type is throwing error
export function mapDispatchToProps (dispatch: React.Dispatch<actions.FetchDashboard | any>) {
  return {
    fetchDashboard: () => dispatch(actions.fetchDashboard()),
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
