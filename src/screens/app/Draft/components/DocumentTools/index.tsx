import * as React from 'react'
import Select from 'react-select'
import { Editor, Value, Operation } from 'slate'
import { pick } from 'lodash'

import { languages as LANGUAGES } from 'src/locale/data.json'

import store from 'src/store'
import { setCurrentDraftLang } from 'src/store/actions/Drafts'

import ToolGroup from '../ToolGroup'

export type Props = {
  editor: Editor,
  value: Value,
}

export default class DocumentTools extends React.Component<Props> {
  render() {
    const { editor, value } = this.props

    const code = value.data.get('language')
    const language = LANGUAGES.find(lang => lang.code === code)

    return (
      <ToolGroup title="editor-tools-document-title">
        <Select
          className="toolbox__select"
          value={language ? {value: language.code, label: language.name} : null}
          onChange={this.setLanguage}
          options={LANGUAGES.map(l => {return {value: l.code, label: l.name}})}
          getOptionLabel={getOptionLabel}
          />
      </ToolGroup>
    )
  }

  setLanguage = ({ value: code }: {value: string, label: string}) => {
    const { editor, value } = this.props

    const newProperties = Value.createProperties({ data: value.data.set('language', code) })
    const prevProperties = pick(value, Object.keys(newProperties))

    editor.applyOperation({
      type: 'set_value',
      properties: prevProperties,
      newProperties,
    } as unknown as Operation)

    store.dispatch(setCurrentDraftLang(code))
  }
}

function getOptionLabel({ label: name }: {value: string, label: string}) {
  return name
}
