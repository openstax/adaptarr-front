import * as React from 'react'
import { match } from 'react-router'
import { History } from 'history'

import * as api from 'src/api'

import Header from 'src/components/Header'
import Load from 'src/components/Load'
import Section from 'src/components/Section'
import ModulePreview from 'src/containers/ModulePreview'

type Props = {
  match: {
    params: {
      id: string
    }
  }
  history: History
  mod: api.Module
}

async function loader({ match }: { match: match<{ id: string }> }) {
  const mod = await api.Module.load(match.params.id)

  return {
    mod,
  }
}

class Module extends React.Component<Props> {
  public render() {
    const { mod } = this.props

    return (
      <Section>
        <Header l10nId="module-view-title" title={mod.title} />
        <div className="section__content">
          <ModulePreview moduleId={mod.id}/>
        </div>
      </Section>
    )
  }
}

export default Load(loader)(Module)
