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
import FreeSlots from 'src/components/FreeSlots'

import * as types from 'src/store/types'
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
  }
}

const mapStateToProps = ({ user, booksMap, modules }: State) => {
  return {
    user,
    booksMap,
    modules,
  }
}

class Dashboard extends React.Component<Props> {

  public state: {
    isLoading: boolean,
    drafts: api.Draft[],
  } = {
    isLoading: true,
    drafts: [],
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
    this.fetchDrafts()
  }

  public render() {
    const { drafts, isLoading } = this.state

    return (
      <Section>
        <Header l10nId="dashboard-view-title" title="Dashboard" />
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
              />
            </div>
            <div className="section__half">
              <h3 className="section__heading">
                <Localized id="dashboard-section-free-slots">
                  Free slots:
                </Localized>
              </h3>
              <FreeSlots
                onUpdate={this.fetchDrafts}
              />
            </div>
          </div>
        }
      </Section>
    )
  }
}

export default connect(mapStateToProps)(Dashboard)
