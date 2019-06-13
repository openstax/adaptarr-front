import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Block, Editor, Value, BlockProperties } from 'slate'
import { MediaDescription } from 'cnx-designer'

import { FileDescription } from 'src/api/storage'

import Modal from 'src/components/Modal'
import AssetPreview from 'src/components/AssetPreview'
import AssetList from 'src/containers/AssetList'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Input from 'src/components/ui/Input'

import ToolGroup from '../ToolGroup'
import Classes from '../Classes'

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

    const subfigure = editor.getActiveSubfigure(value) // This will return figure if there is no subfigure
    const image = (subfigure!.nodes.first() as Block).nodes.first() as Block
    const src = image.data.get('src')
    const media = subfigure!.nodes.first() as Block
    const altText = media.data.get('alt')

    return (
      <ToolGroup title="editor-tools-figure-title">
        <div className="assetPreview">
          <AssetPreview
            asset={{ name: src, mime: 'image/any' }}
            onClick={this.changeSubfigure}
          />
          {figure !== subfigure && <Button clickHandler={this.removeSubfigure} className="toolbox__button--insert">
            <Icon name="close" />
            <Localized id="editor-tools-remove-subfigure">
              Remove subfigure
            </Localized>
          </Button>}
        </div>
        <Button clickHandler={this.insertSubfigure} className="toolbox__button--insert">
          <Icon name="image" />
          <Localized id="editor-tools-figure-add-subfigure">
            Add subfigure
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertCaption}
          isDisabled={(figure.nodes.last() as Block).type === 'figure_caption'}
          className="toolbox__button--insert"
        >
          <Icon name="comment" />
          <Localized id="editor-tools-figure-add-caption">
            Add caption
          </Localized>
        </Button>
        <Classes editor={editor} block={figure} />
        <label className="figure__alt-text">
          <span>
            <Localized id="editor-tools-figure-alt-text">
              Alt text:
            </Localized>
          </span>
          <Input
            value={altText}
            onChange={this.onAltChange}
          />
        </label>
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

  private onAltChange = (text: string) => {
    const { editor, value } = this.props
    // getActiveSubfigure will return figure if there is no subfigure
    const figure = editor.getActiveSubfigure(value)
    if (!figure) return null

    const media = figure.nodes.first() as Block

    let newData = media.data.set('alt', text)

    editor.setNodeByKey(media.key, { type: media.type, data: newData })
    return
  }
}
