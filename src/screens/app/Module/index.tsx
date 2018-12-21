import * as React from 'react'
import { Trans } from 'react-i18next'
import { History } from 'history'

import axios from 'src/config/axios'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import UserUI from 'src/components/UserUI'
import Button from 'src/components/ui/Button'

import ModulePreview from 'src/containers/ModulePreview'

import { ModuleShortInfo } from 'src/store/types'

type Props = {
  match: {
    params: {
      id: string
    }
  }
  history: History
}

class Module extends React.Component<Props> {
  
  state: {
    isLoading: boolean
    mod: ModuleShortInfo | undefined
    isDraftExisting: boolean
    error?: string
  } = {
    isLoading: true,
    mod: undefined,
    isDraftExisting: false,
  }

  private fetchModuleInfo = () => {
    axios.get(`modules/${this.props.match.params.id}`)
      .then(res => {
        this.setState({ isLoading: false, mod: res.data, error: '' })
      })
      .catch(() => {
        this.props.history.push('/404')
      })
  }

  private isDraftExisting = () => {
    axios.get(`drafts/${this.props.match.params.id}`)
      .then(() => {
        this.setState({ isDraftExisting: true })
      })
      .catch(() => {
        this.setState({ isDraftExisting: false })
      })
  }

  private createDraft (moduleId: string) {
    if (!moduleId) return

    axios.post(`modules/${moduleId}`)
      .then(() => {
        store.dispatch(addAlert('success', 'Draft was created successfully.'))
        this.props.history.push(`/drafts/${moduleId}`)
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchModuleInfo()
      this.isDraftExisting()
    }
  }

  componentDidMount = () => {
    this.fetchModuleInfo()
    this.isDraftExisting()
  }

  public render() {
    const { isLoading, mod, isDraftExisting, error } = this.state

    return (
      <Section>
        <Header title={mod ? mod.title : 'Unknow module'}>
          {
            mod ?
              <UserUI userId={mod.assignee}>
                {
                  isDraftExisting ?
                    <Button to={`/drafts/${mod.id}`}>
                      <Trans i18nKey="Buttons.viewDraft"/>
                    </Button>
                  :
                  <Button
                    color="green"
                    clickHandler={() => {this.createDraft(mod.id)}}
                  >
                    <Trans i18nKey="Buttons.newDraft"/>
                  </Button>
                }
              </UserUI>
            : null
          }
        </Header>
        <div className="section__content">
          {
            isLoading ?
              <Spinner/>
            :
              <React.Fragment>
                {
                  mod ?
                    <ModulePreview moduleId={mod.id}/>
                  : error
                }
              </React.Fragment>
          }
        </div>
      </Section>
    )
  }
}

export default Module
