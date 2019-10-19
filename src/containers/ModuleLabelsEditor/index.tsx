import * as React from 'react'
import { connect } from 'react-redux'
import { Localized } from 'fluent-react/compat'

import { State } from 'src/store/reducers'
import { Labels } from 'src/store/types'

import ModuleLabelCreator from './ModuleLabelCreator'
import MLEItem from './MLEItem'
import Button from 'src/components/ui/Button'
import Input from 'src/components/ui/Input'

import './index.css'

interface ModuleLabelsEditorProps {
  labels: Labels
}

const mapStateToProps = ({ modules: { labels } }: State) => ({
  labels,
})

const ModuleLabelsEditor = ({ labels }: ModuleLabelsEditorProps) => {
  const [search, setSearch] = React.useState('')
  const regExp = new RegExp(search, 'i')
  const filteredLabels = Object.values(labels).filter(l => l.name.match(regExp))
  const [showCreateForm, setShowCreateForm] = React.useState(false)

  const onChange = (text: string) => {
    setSearch(text)
  }

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm)
  }

  return (
    <div className="module-labels-editor">
      <div className="module-labels-editor__header">
        <Input l10nId="module-labels-editor-search" onChange={onChange} />
        <Button clickHandler={toggleCreateForm}>
          <Localized id="module-labels-editor-new-label">
            New label
          </Localized>
        </Button>
      </div>
      {
        showCreateForm
          ?
          <ModuleLabelCreator
            onCancel={toggleCreateForm}
            afterCreate={toggleCreateForm}
          />
          : null
      }
      <ul className="module-labels-editor__list">
        {
          filteredLabels.length
            ? filteredLabels.map(label => (
              <li key={label.id}>
                <MLEItem label={label} />
              </li>
            ))
            :
            <li className="module-labels-editor__no-labels">
              <Localized id="module-labels-editor-no-labels">
                No labels found
              </Localized>
            </li>
        }
      </ul>
    </div>
  )
}

export default connect(mapStateToProps)(ModuleLabelsEditor)
