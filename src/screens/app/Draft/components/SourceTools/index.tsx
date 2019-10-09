import * as React from 'react'
import Select from 'react-select'
import { Editor, Value, Block, Inline, Text } from 'slate'
import { Localized } from 'fluent-react/compat'
import { List } from 'immutable'

import ToolGroup from '../ToolGroup'

import { OnToggle } from '../ToolboxDocument'

import './index.css'

const SOURCE_TYPES: string[] = ['inline', 'block']

export type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

class SourceTools extends React.Component<Props> {
  public render() {
    const source = this.getActiveSource()

    if (source === null) return null

    return (
      <ToolGroup
        title="editor-tools-source-title"
        toggleState={this.props.toggleState}
        onToggle={() => this.props.onToggle('sourceTools')}
      >
        <label className="toolbox__label">
          <Localized id="editor-tools-source-type-label">
            Show element as:
          </Localized>
        </label>
        <Select
          className="toolbox__select react-select"
          value={{value: source.object, label: source.object}}
          onChange={this.onChange}
          options={SOURCE_TYPES.map(t => {return {value: t, label: t}})}
          formatOptionLabel={OptionLabel}
        />
        <div className="source__error">
          { this.validateSource(source) }
        </div>
      </ToolGroup>
    )
  }

  onChange = ({value}: {value: string, label: string}) => {
    const editor = this.props.editor
    const source = this.getActiveSource()
    if (!source) return

    if (value === 'block' && source.object !== 'block') {
      editor.removeNodeByKey(source.key)
      editor.insertBlock({
        type: 'source_element',
        nodes: source.nodes,
      })
    }

    if (value === 'inline' && source.object !== 'inline') {
      editor.removeNodeByKey(source.key)
      editor.insertInline({
        type: 'source_element',
        nodes: source.nodes as List<Inline | Text>,
      })
    }
  }

  getActiveSource = (): Block | Inline | null => {
    const block = this.props.value.startBlock
    const inline = this.props.value.startInline

    if (block && block.type === 'source_element') {
      return block
    }

    if (inline && inline.type === 'source_element') {
      return inline
    }

    return null
  }

  validateSource = (source: Block | Inline): null | string => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(source.getText().trim(), 'text/xml')
    const error = xmlDoc.getElementsByTagName('parsererror')
    if (error.length) {
      return error[0].textContent
    }
    return null
  }
}

function OptionLabel({value: type}: {value: string, label: string}) {
  return <Localized id="editor-tools-source-type" $type={type}>{type}</Localized>
}

export default SourceTools
