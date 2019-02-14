import './index.css'

import * as React from 'react'
import { Trans } from 'react-i18next'
import { Block, Editor, Value, BlockProperties } from 'slate'
import { MediaDescription } from 'cnx-designer'

import { FileDescription } from 'src/api/storage'

import Modal from 'src/components/Modal'
import AssetPreview from 'src/components/AssetPreview'
import AssetList from 'src/containers/AssetList'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import ToolGroup from '../ToolGroup'

export type Props = {
  editor: Editor,
  value: Value,
}

export default class FigureTools extends React.Component<Props> {
  modal: Modal | null = null
  action: ((asset: MediaDescription) => void) | null = null

  render() {
    const { editor, value } = this.props
    const figure = editor.getActiveFigure(value)

    if (figure === null) return null

    const subfigure = editor.getActiveSubfigure(value)
    const image = (subfigure!.nodes.first() as unknown as Block).nodes.first() as unknown as Block
    const src = image.data.get('src')

    return (
      <ToolGroup title="Editor.figure.groupTitle">
        <div className="assetPreview">
          <AssetPreview
            asset={{ name: src, mime: 'image/any' }}
            onClick={this.changeSubfigure}
          />
          {figure !== subfigure && <Button clickHandler={this.removeSubfigure} className="toolbox__button--insert">
            <Icon name="close" />
            <Trans i18nKey="Editor.figure.removeSubfigure" />
          </Button>}
        </div>
        <Button clickHandler={this.insertSubfigure} className="toolbox__button--insert">
          <Icon name="image" />
          <Trans i18nKey="Editor.figure.insert.subfigure" />
        </Button>
        <Button
          clickHandler={this.insertCaption}
          isDisabled={(figure.nodes.last() as Block).type === 'figure_caption'}
          className="toolbox__button--insert"
        >
          <Icon name="comment" />
          <Trans i18nKey="Editor.figure.insert.caption" />
        </Button>
        <Modal
          ref={this.setModal}
          content={this.renderModal}
        />
      </ToolGroup>
    )
  }

  private setModal = (el: Modal | null) => el && (this.modal = el)

  private renderModal = () => (
    <AssetList
      filter="image/*"
      onSelect={this.onAssetSelected}
    />
  )

  private insertSubfigure = () => {
    this.action = this.props.editor.insertSubfigure
    this.modal!.open()
  }

  private changeSubfigure = () => {
    const { editor, value } = this.props

    this.action = (asset: MediaDescription) => {
      const subfigure = editor.getActiveSubfigure(value)
      const image = (subfigure!.nodes.first() as unknown as Block).nodes.first() as unknown as Block

      editor.setNodeByKey(image.key, {
        data: { src: asset.name },
      } as unknown as BlockProperties)
    }
    this.modal!.open()
  }

  private removeSubfigure = () => {
    const { editor, value } = this.props
    const subfigure = editor.getActiveSubfigure(value)!
    editor.removeNodeByKey(subfigure.key)
  }

  private insertCaption = () => this.props.editor.insertCaption()

  private onAssetSelected = (asset: FileDescription) => {
    this.modal!.close()
    this.action!(asset as MediaDescription)
    this.action = null
  }
}
