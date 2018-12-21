import * as React from 'react'
import { History } from 'history'

import axios from 'src/config/axios'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'

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
    error?: string
  } = {
    isLoading: true,
    mod: undefined,
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

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchModuleInfo()
    }
  }

  componentDidMount = () => {
    this.fetchModuleInfo()
  }

  public render() {
    const { isLoading, mod, error } = this.state

    return (
      <Section>
        <Header title={mod ? mod.title : 'Unknow module'}/>
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
