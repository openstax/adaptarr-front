import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { Editor, Value } from 'slate'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import ToolGroup from '../ToolGroup'
import Classes from '../Classes'

import { OnToggle } from '../ToolboxDocument'

const LIST_STYLES: string[] = ['ol_list', 'ul_list']

interface ListToolsProps {
  editor: Editor
  value: Value
  toggleState: boolean
  onToggle: OnToggle
}

export default class ListTools extends React.Component<ListToolsProps> {
  private onClickToggle = () => {
    this.props.onToggle('listTools')
  }

  render() {
    const { editor, value } = this.props
    const list = editor.getCurrentList(value)

    if (list === null) return null

    return (
      <ToolGroup
        title="editor-tools-list-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        <Select
          className="toolbox__select react-select"
          value={{ value: list.type, label: list.type }}
          onChange={this.changeListStyle}
          options={LIST_STYLES.map(t => ({ value: t, label: t }))}
          formatOptionLabel={OptionLabel}
        />
        <Button
          clickHandler={this.decreaseItemDepth}
          className="toolbox__button--insert"
        >
          <Icon size="small" name="outdent" />
          <Localized id="editor-tools-list-decrease-level">
            Decrease item level
          </Localized>
        </Button>
        <Button
          clickHandler={this.increaseItemDepth}
          className="toolbox__button--insert"
        >
          <Icon size="small" name="indent" />
          <Localized id="editor-tools-list-increase-level">
            Increase item level
          </Localized>
        </Button>
        <Classes editor={editor} block={list} />
      </ToolGroup>
    )
  }

  private changeListStyle = ({ value }: {value: string, label: string}) => {
    this.props.editor.changeListType(value)
  }

  private decreaseItemDepth = () => {
    this.props.editor.decreaseItemDepth()
    this.props.editor.focus()
  }

  private increaseItemDepth = () => {
    this.props.editor.increaseItemDepth()
    this.props.editor.focus()
  }
}

function OptionLabel({ value: style }: { value: string, label: string }) {
  return <Localized id="editor-tools-list-style" $style={style}>{style}</Localized>
}
