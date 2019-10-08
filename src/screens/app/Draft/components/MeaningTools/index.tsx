import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { OnToggle } from '../ToolboxGlossary'

interface DefinitionToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

class DefinitionTools extends React.Component<DefinitionToolsProps> {
  private onClickToggle = () => {
    this.props.onToggle('meaningTools')
  }

  public render() {
    const meaning = this.props.editor.getActiveDefinitionMeaning(this.props.value)

    return meaning && (
      <ToolGroup
        title="editor-tools-meaning-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        <Button clickHandler={this.insertExample} className="toolbox__button--insert">
          <Icon size="small" name="plus" />
          <Localized id="editor-tools-meaning-insert-example">
            Add example
          </Localized>
        </Button>
      </ToolGroup>
    )
  }

  insertExample = () => {
    this.props.editor.addExampleToMeaning()
  }
}

export default DefinitionTools
