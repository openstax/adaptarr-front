import * as React from 'react'
import { match } from 'react-router'
import { History } from 'history'
import { Localized } from 'fluent-react/compat'

import { Module, Draft } from 'src/api'

import Header from 'src/components/Header'
import Load from 'src/components/Load'
import Section from 'src/components/Section'
import Button from 'src/components/ui/Button'

import ModulePreview from 'src/containers/ModulePreview'

type Props = {
  match: {
    params: {
      id: string
    }
  }
  history: History
  mod: Module
  isDraftExisting: boolean
}

async function loader({ match }: { match: match<{ id: string }> }) {
  const [module, draft] = await Promise.all([
    Module.load(match.params.id),
    Draft.load(match.params.id).catch(() => null)
  ])

  return {
    mod: module,
    isDraftExisting: draft !== null,
  }
}

class _Module extends React.Component<Props> {
  public render() {
    const { mod, isDraftExisting } = this.props

    return (
      <Section>
        <Header l10nId="module-view-title" title={mod.title}>
          {
            isDraftExisting ?
              <Button
                withBorder={true}
                to={`/drafts/${mod.id}/edit`}
              >
                <Localized id="module-open-draft">
                  Open draft
                </Localized>
              </Button>
            : null
          }
        </Header>
        <div className="section__content">
          <ModulePreview moduleId={mod.id}/>
        </div>
      </Section>
    )
  }
}

export default Load(loader)(_Module)
