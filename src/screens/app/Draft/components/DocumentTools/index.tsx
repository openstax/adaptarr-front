import * as React from 'react'
import * as PropTypes from 'prop-types'
import Select from 'react-select'
import { Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import { languages as LANGUAGES } from 'src/locale/data.json'

import store from 'src/store'
import { setCurrentDraftLang } from 'src/store/actions/drafts'
import Storage from 'src/api/storage'

import ToolGroup from '../ToolGroup'
import CharactersCounter from '../CharactersCounter'

import { OnToggle } from '../ToolboxDocument'

interface DocumentToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class DocumentTools extends React.Component<DocumentToolsProps> {
  static contextTypes = {
    storage: PropTypes.instanceOf(Storage),
  }

  private onClickToggle = () => {
    this.props.onToggle('documentTools')
  }

  render() {
    const { value } = this.props

    const code = this.context.storage.language
    const language = LANGUAGES.find(lang => lang.code === code)

    return (
      <ToolGroup
        title="editor-tools-document-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        <label className="toolbox__label">
          <span className="toolbox__title">
            <Localized id="editor-tools-document-select-language">
              Select document language
            </Localized>
          </span>
          <Select
            className="toolbox__select react-select"
            value={language ? { value: language.code, label: language.name } : null}
            onChange={this.setLanguage}
            options={LANGUAGES.map(l => ({ value: l.code, label: l.name }))}
            getOptionLabel={getOptionLabel}
          />
        </label>
        <CharactersCounter value={value} />
      </ToolGroup>
    )
  }

  setLanguage = ({ value: code }: {value: string, label: string}) => {
    this.context.storage.setLanguage(code)

    store.dispatch(setCurrentDraftLang(code))
  }
}

function getOptionLabel({ label: name }: {value: string, label: string}) {
  return name
}
