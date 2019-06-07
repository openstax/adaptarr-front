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
          value={language}
          onChange={this.setLanguage}
          options={LANGUAGES}
          getOptionLabel={getOptionLabel}
          />
      </ToolGroup>
    )
  }

  setLanguage = ({ code }: typeof LANGUAGES[0]) => {
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

function getOptionLabel({ name }: typeof LANGUAGES[0]) {
  return name
}
