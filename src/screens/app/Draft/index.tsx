import * as React from 'react'
import { Trans } from 'react-i18next'

import axios from 'src/config/axios'
import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import Button from 'src/components/ui/Button'

import { ModuleShortInfo } from 'src/store/types'

type Props = {
  match: {
    params: {
      id: string
    }
  }
}

class Module extends React.Component<Props> {
  
  state: {
    isLoading: boolean
    mod: ModuleShortInfo | undefined
    index: string
    error?: string
  } = {
    isLoading: true,
    mod: undefined,
    index: '',
  }

  private saveDraft = () => {
    const draftId = this.props.match.params.id

    axios.post(`drafts/${draftId}/save`)
      .then(() => {
        store.dispatch(addAlert('success', 'Draft saved successfully.'))
        window.location.href = `/modules/${draftId}`
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  private fetchDraftFiles = () => {
    const draftId = this.props.match.params.id

    axios.get(`drafts/${draftId}/files`)
      .then(res => {
        this.setState({ files: res.data })
      })
      .catch(e => {
        this.setState({ files: undefined })
        store.dispatch(addAlert('error', e.message))
      })

    axios.get(`drafts/${draftId}/files/index.cnxml`)
      .then(res => {
        this.setState({ isLoading: false, index: res.data, error: '' })
      })
      .catch(e => {
        this.setState({ isLoading: false, index: undefined, error: e.message })
        store.dispatch(addAlert('error', e.message))
      })
  }

  private fetchModuleInfo = () => {
    axios.get(`modules/${this.props.match.params.id}`)
      .then(res => {
        this.setState({ mod: res.data })
      })
      .catch(e => {
        this.setState({ mod: undefined })
        store.dispatch(addAlert('error', e.message))
      })
  }

  componentDidMount = () => {
    this.fetchModuleInfo()
    this.fetchDraftFiles()
  }

  public render() {
    const { isLoading, mod, index, error } = this.state

    return (
      <Section>
        <Header title={mod ? mod.title : 'Unknow module'}>
          <Button clickHandler={() => this.saveDraft()}>
            <Trans i18nKey="Buttons.save"/>
          </Button>
        </Header>
        <div className="section__content">
          {
            isLoading ?
              <Spinner/>
            :
              <React.Fragment>
                {
                  index ?
                    <div 
                      className="draftEditor"
                      dangerouslySetInnerHTML={{__html: index}}
                    >
                    </div>
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
