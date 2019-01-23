import * as React from 'react'
import { Trans } from 'react-i18next'
import { Editor, Value } from 'slate'
import { EditorAug, MediaDescription } from 'cnx-designer'

import { FileDescription } from 'src/api/storage'

import Modal from 'src/components/Modal'
import AssetList from 'src/containers/AssetList'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import ToolGroup from '../ToolGroup'

export type Props = {
  editor: Editor,
  value: Value,
}

export default class InsertTools extends React.Component<Props> {
  modal: Modal | null = null

  render() {
    const { editor, value } = this.props

    return (
      <ToolGroup title="Editor.insert.groupTitle">
        <Button className="toolbox__button--insert">
          <Icon name="link" />
          <Trans i18nKey="Editor.insert.reference" />
        </Button>
        <Button clickHandler={this.insertAdmonition} className="toolbox__button--insert">
          <Icon name="sticky-note" />
          <Trans i18nKey="Editor.insert.admonition" />
        </Button>
        <Button
          clickHandler={this.insertExercise}
          isDisabled={editor.query('getActiveExercise', value) !== null}
          className="toolbox__button--insert"
        >
          <Icon name="flask" />
          <Trans i18nKey="Editor.insert.exercise" />
        </Button>
        <Button clickHandler={this.openModal} className="toolbox__button--insert">
          <Icon name="image" />
          <Trans i18nKey="Editor.insert.figure" />
        </Button>
        <Modal
          ref={this.setModal}
          content={this.renderModal}
        />
      </ToolGroup>
    )
  }

  private renderModal = () => (
    <AssetList
      filter="image/*"
      onSelect={this.insertFigure}
      />
  )

  private setModal = (el: Modal | null) => el && (this.modal = el)

  private openModal = () => this.modal!.open()

  private insertAdmonition = () => {
    // TODO: clicking insert admonition should expand a menu where the user can
    // choose which kind of admonition to insert.
    ;(this.props.editor as EditorAug).insertAdmonition('note')
  }

  private insertExercise = () => {
    ;(this.props.editor as EditorAug).insertExercise()
  }

  private insertFigure = (asset: FileDescription) => {
    this.modal!.close()
    // XXX: We cast FileDescription as MediaDescription, as currently there
    // is no way to add alt-texts, server doesn't store it yet, and it is not
    // used anywhere.
    ;(this.props.editor as EditorAug).insertFigure(asset as MediaDescription)
  }
}
