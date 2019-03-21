import * as React from 'react'
import Select from 'react-select'
import { Editor, Value, Operation } from 'slate'

import { languages as LANGUAGES } from 'src/locale/data.json'

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

    editor.applyOperation({
      type: 'set_value',
      properties: {
        data: value.data.set('language', code),
      },
    } as unknown as Operation)
  }
}

function getOptionLabel({ name }: typeof LANGUAGES[0]) {
  return name
}
