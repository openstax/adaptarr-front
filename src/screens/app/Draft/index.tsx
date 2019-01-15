import * as React from 'react'
import { History } from 'history'
import { Trans } from 'react-i18next'

import i18n from 'src/i18n'

import * as api from 'src/api'

import updateImgSrcs from 'src/helpers/updateImgSrcs'

import Section from 'src/components/Section'
import Header from 'src/components/Header'
import Spinner from 'src/components/Spinner'
import UserUI from 'src/components/UserUI'
import Button from 'src/components/ui/Button'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

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
    mod: api.Module | undefined
    draft?: api.Draft
    index: string
    error?: string
  } = {
    isLoading: true,
    mod: undefined,
    index: '',
  }

  private saveDraft = () => {
    const { draft } = this.state

    draft!.save()
      .then(() => {
        store.dispatch(addAlert('success', i18n.t("Draft.saveSuccess")))
        this.props.history.push(`/modules/${draft!.module}`)
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  private fetchDraftFiles = () => {
    const draftId = this.props.match.params.id

    api.Draft.load(draftId)
      .then(draft => Promise.all([
        draft,
        draft.files(),
        draft.read('index.cnxml')
      ]))
      .then(([draft, files, index]) => this.setState({ isLoading: false, draft, files, index }))
      .catch(e => {
        this.setState({ isLoading: false, error: e.message })
        store.dispatch(addAlert('error', e.message))
      })
  }

  private fetchModuleInfo = () => {
    api.Module.load(this.props.match.params.id)
      .then(res => {
        this.setState({ mod: res })
      })
      .catch(() => {
        this.props.history.push('/404')
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
        <Header title={mod ? mod.title : i18n.t("Unknown.module")}>
          {
            mod ?
              <UserUI userId={mod.assignee}>
                <Button
                  color="green"
                  clickHandler={this.saveDraft}
                >
                  <Trans i18nKey="Buttons.save"/>
                </Button>
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
                  index && mod ?
                    <div 
                      className="draftEditor cnxml"
                      dangerouslySetInnerHTML={{__html: updateImgSrcs(index, mod.id)}}
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
