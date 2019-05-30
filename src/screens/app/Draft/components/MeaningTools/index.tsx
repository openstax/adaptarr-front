import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

export type Props = {
  editor: Editor,
  value: Value,
}

class DefinitionTools extends React.Component<Props> {
  public render() {
    const meaning = this.props.editor.getActiveDefinitionMeaning(this.props.value)

    return meaning && (
      <ToolGroup title="editor-tools-meaning-title">
        <Button clickHandler={this.insertExample} className="toolbox__button--insert">
          <Icon name="plus" />
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
