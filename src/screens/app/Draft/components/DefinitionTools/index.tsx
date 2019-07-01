import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { OnToggle } from '../ToolboxGlossary'

export type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

class DefinitionTools extends React.Component<Props> {
  public render() {
    const { editor, value } = this.props
    const definition = editor.getActiveDefinition(value)

    return definition && (
      <ToolGroup
        title="editor-tools-definition-title"
        toggleState={this.props.toggleState}
        onToggle={() => this.props.onToggle('definitionTools')}
      >
        <Button clickHandler={this.insertDefinitionBefore} className="toolbox__button--insert">
          <Icon name="plus" />
          <Localized id="editor-tools-definition-insert-definition-before">
            Insert definition before
          </Localized>
        </Button>
        <Button clickHandler={this.insertDefinitionAfter} className="toolbox__button--insert">
          <Icon name="plus" />
          <Localized id="editor-tools-definition-insert-definition-after">
            Insert definition after
          </Localized>
        </Button>
        <Button clickHandler={this.removeDefinition} className="toolbox__button--insert">
          <Icon name="close" />
          <Localized id="editor-tools-definition-remove-definition">
            Remove definition
          </Localized>
        </Button>
        <Button clickHandler={this.insertMeaning} className="toolbox__button--insert">
          <Icon name="plus" />
          <Localized id="editor-tools-definition-insert-meaning">
            Add meaning
          </Localized>
        </Button>
        <Button clickHandler={this.insertSeeAlso} className="toolbox__button--insert">
          <Icon name="plus" />
          <Localized id="editor-tools-definition-insert-seealso">
            Add see also
          </Localized>
        </Button>
      </ToolGroup>
    )
  }

  insertDefinitionBefore = () => this.props.editor.insertDefinition('before')
  insertDefinitionAfter = () => this.props.editor.insertDefinition('after')
  removeDefinition = () => {
    const { editor, value } = this.props
    const definition = editor.getActiveDefinition(value)
    if (!definition) return
    this.props.editor.removeNodeByKey(definition.key)
  }
  insertMeaning = () => this.props.editor.addMeaningToDefinition()
  insertSeeAlso = () => this.props.editor.addSeeAlsoToDefinition()
}

export default DefinitionTools
