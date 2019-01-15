import * as React from 'react'
import { History } from 'history'
import { Trans } from 'react-i18next'
import { match } from 'react-router'

import i18n from 'src/i18n'

import * as api from 'src/api'

import updateImgSrcs from 'src/helpers/updateImgSrcs'

import Header from 'src/components/Header'
import Load from 'src/components/Load'
import Section from 'src/components/Section'
import Spinner from 'src/components/Spinner'
import UserUI from 'src/components/UserUI'
import Button from 'src/components/ui/Button'

import store from 'src/store'
import { addAlert } from 'src/store/actions/Alerts'

type Props = {
  history: History
  mod: api.Module
  draft: api.Draft
  index: string
}

async function loader({ match }: { match: match<{ id: string }> }) {
  const [module, draft] = await Promise.all([
    api.Module.load(match.params.id),
    api.Draft.load(match.params.id),
  ])
  const index = await draft.read('index.cnxml')

  return { mod: module, draft, index }
}

class Module extends React.Component<Props> {
  private saveDraft = () => {
    const { draft } = this.props

    draft!.save()
      .then(() => {
        store.dispatch(addAlert('success', i18n.t("Draft.saveSuccess")))
        this.props.history.push(`/modules/${draft!.module}`)
      })
      .catch(e => {
        store.dispatch(addAlert('error', e.message))
      })
  }

  public render() {
    const { mod, index } = this.props

    return (
      <Section>
        <Header title={mod ? mod.title : i18n.t("Unknown.module")}>
          <UserUI userId={mod.assignee}>
            <Button
              color="green"
              clickHandler={this.saveDraft}
            >
              <Trans i18nKey="Buttons.save"/>
            </Button>
          </UserUI>
        </Header>
        <div className="section__content">
          <div
            className="draftEditor cnxml"
            dangerouslySetInnerHTML={{__html: updateImgSrcs(index, mod.id)}}
            />
        </div>
      </Section>
    )
  }
}

export default Load(loader)(Module)
