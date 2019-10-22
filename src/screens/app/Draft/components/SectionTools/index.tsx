import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import Classes from '../Classes'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { OnToggle } from '../ToolboxDocument'

interface SectionToolsProps {
  editor: Editor
  value: Value
  toggleState: boolean
  onToggle: OnToggle
}

export default class SectionTools extends React.Component<SectionToolsProps> {
  private onClickToggle = () => {
    this.props.onToggle('sectionTools')
  }

  render() {
    const { editor, value } = this.props
    const section = editor.getActiveSection(value)

    if (section === null) return null

    return (
      <ToolGroup
        title="editor-tools-sections-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        <Button
          clickHandler={this.decreaseSectionDepth}
          className="toolbox__button--insert"
        >
          <Icon size="small" name="outdent" />
          <Localized id="editor-tools-sections-decrease-depth">
            Decrease level
          </Localized>
        </Button>
        <Button
          clickHandler={this.increaseSectionDepth}
          className="toolbox__button--insert"
        >
          <Icon size="small" name="indent" />
          <Localized id="editor-tools-sections-increase-depth">
            Increase level
          </Localized>
        </Button>
        <Classes editor={editor} block={section} />
      </ToolGroup>
    )
  }

  private decreaseSectionDepth = () => {
    this.props.editor.decreaseSectionDepth()
  }

  private increaseSectionDepth = () => {
    this.props.editor.increaseSectionDepth()
  }
}
