import * as React from 'react'
import { Editor, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import ToolGroup from '../ToolGroup'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { OnToggle } from '../ToolboxGlossary'

import './index.css'

interface SeeAlsoToolsProps {
  editor: Editor
  value: Value
  toggleState: boolean
  onToggle: OnToggle
}

class SeeAlsoTools extends React.Component<SeeAlsoToolsProps> {
  private onClickToggle = () => {
    this.props.onToggle('seeAlsoTools')
  }

  render() {
    const seealso = this.getActiveSeeAlso()

    return seealso && (
      <ToolGroup
        title="editor-tools-seealso-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        <Button
          clickHandler={this.insertTerm}
          className="toolbox__button--insert"
        >
          <Icon size="small" name="plus" />
          <Localized id="editor-tools-seealso-add-term">
            Add term
          </Localized>
        </Button>
        <Button
          clickHandler={this.removeTerm}
          className="toolbox__button--insert"
        >
          <Icon size="small" name="minus" />
          <Localized id="editor-tools-seealso-remove-term">
            Remove term
          </Localized>
        </Button>
      </ToolGroup>
    )
  }

  private getActiveSeeAlso = () => {
    const { value: { document, startBlock } } = this.props
    if (!startBlock) return null
    const parent = document.getParent(startBlock.key)
    if (!parent || parent.object === 'text') return null
    return parent && parent.type === 'definition_seealso' ? parent : null
  }

  private insertTerm = () => {
    this.props.editor.insertBlock('definition_term')
  }

  private removeTerm = () => {
    const { value: { startBlock }, editor } = this.props
    if (startBlock && startBlock.type === 'definition_term') {
      editor.removeNodeByKey(startBlock.key)
    }
  }
}

export default SeeAlsoTools
