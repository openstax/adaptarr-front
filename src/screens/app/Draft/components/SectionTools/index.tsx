import * as React from 'react'
import { Trans } from 'react-i18next'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

export type Props = {
  editor: Editor,
  value: Value,
}

export default class SectionTools extends React.Component<Props> {
  render() {
    const { editor, value } = this.props
    const section = editor.getActiveSection(value)

    if (section === null) return null

    return (
      <ToolGroup title="Editor.section.groupTitle">
        <Button
          clickHandler={this.decreaseSectionDepth}
          className="toolbox__button--insert"
        >
          <Icon name="outdent" />
          <Trans i18nKey="Editor.section.decreaseLevel" />
        </Button>
        <Button
          clickHandler={this.increaseSectionDepth}
          className="toolbox__button--insert"
        >
          <Icon name="indent" />
          <Trans i18nKey="Editor.section.increaseLevel" />
        </Button>
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
