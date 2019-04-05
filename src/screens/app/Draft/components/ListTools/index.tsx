import * as React from 'react'
import Select from 'react-select'
import { Localized } from 'fluent-react/compat'
import { Block, Editor, Value } from 'slate'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import ToolGroup from '../ToolGroup'
import Classes from '../Classes'

const LIST_STYLES: string[] = ['ol_list','ul_list']

export type Props = {
  editor: Editor,
  value: Value,
}

export default class ListTools extends React.Component<Props> {
  render() {
    const { editor, value } = this.props
    const list = editor.getCurrentList(value)

    if (list === null) return null

    return (
      <ToolGroup title="editor-tools-list-title">
        <Select
          className="toolbox__select"
          value={list.type}
          onChange={this.changeListStyle}
          options={LIST_STYLES}
          formatOptionLabel={OptionLabel}
        />
        <Button
          clickHandler={this.decreaseItemDepth}
          className="toolbox__button--insert"
        >
          <Icon name="outdent" />
          <Localized id="editor-tools-list-decrease-level">
            Decrease item level
          </Localized>
        </Button>
        <Button
          clickHandler={this.increaseItemDepth}
          className="toolbox__button--insert"
        >
          <Icon name="indent" />
          <Localized id="editor-tools-list-increase-level">
            Increase item level
          </Localized>
        </Button>
        <Classes editor={editor} block={list} />
      </ToolGroup>
    )
  }

  private changeListStyle = (value: string) => {
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

function OptionLabel(style: string) {
  return <Localized id="editor-tools-list-style" $style={style} />
}
