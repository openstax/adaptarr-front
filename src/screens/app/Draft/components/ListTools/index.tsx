import * as React from 'react'
import Select from 'react-select'
import { Trans } from 'react-i18next'
import { Block, Editor, Value } from 'slate'

import i18n from 'src/i18n'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import ToolGroup from '../ToolGroup'

type ListStyle = { value: string, label: string }

const LIST_STYLES: ListStyle[] = [
  { value: 'ol_list', label: i18n.t('Editor.list.style.ol_list') },
  { value: 'ul_list', label: i18n.t('Editor.list.style.ul_list') },
]

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
      <ToolGroup title="Editor.list.groupTitle">
        <Select
          className="toolbox__select"
          value={{ value: list.type, label: i18n.t(`Editor.list.style.${list.type}`) as string }}
          onChange={this.changeListStyle}
          options={LIST_STYLES}
        />
        <Button
          clickHandler={this.decreaseItemDepth}
          className="toolbox__button--insert"
        >
          <Icon name="outdent" />
          <Trans i18nKey="Editor.list.decreaseLevel" />
        </Button>
        <Button
          clickHandler={this.increaseItemDepth}
          className="toolbox__button--insert"
        >
          <Icon name="indent" />
          <Trans i18nKey="Editor.list.increaseLevel" />
        </Button>
      </ToolGroup>
    )
  }

  private changeListStyle = ({ value }: ListStyle) => {
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
