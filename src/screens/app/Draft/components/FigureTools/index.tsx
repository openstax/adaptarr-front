import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Block, BlockProperties, Editor, Value } from 'slate'
import { MediaDescription } from 'cnx-designer'

import { FileDescription } from 'src/api/storage'

import Modal from 'src/components/Modal'
import AssetPreview from 'src/components/AssetPreview'
import AssetList from 'src/containers/AssetList'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import ToolGroup from '../ToolGroup'
import Classes from '../Classes'

import { OnToggle } from '../ToolboxDocument'

import './index.css'

interface FigureToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class FigureTools extends React.Component<FigureToolsProps> {
  modal: Modal | null = null

  action: ((asset: MediaDescription) => void) | null = null

  private onClickToggle = () => {
    this.props.onToggle('figureTools')
  }

  render() {
    const { editor, value } = this.props
    const figure = editor.getActiveFigure(value)

    if (figure === null) return null

    // This will return figure if there is no subfigure
    const subfigure = editor.getActiveSubfigure(value)
    const image = (subfigure!.nodes.first() as Block).nodes.first() as Block
    const src = image.data.get('src')
    const media = editor.getActiveMedia(value)
    const mediaText = media && media.nodes.find(m => (m as Block).type === 'media_text')

    return (
      <ToolGroup
        title="editor-tools-figure-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        <div className="assetPreview">
          <AssetPreview
            asset={{ name: src, mime: 'image/any' }}
            onClick={this.changeSubfigure}
          />
          {
            figure !== subfigure &&
            <Button clickHandler={this.removeSubfigure} className="toolbox__button--insert">
              <Icon size="small" name="close" />
              <Localized id="editor-tools-figure-remove-subfigure">
                Remove subfigure
              </Localized>
            </Button>
          }
        </div>
        <Button clickHandler={this.insertSubfigure} className="toolbox__button--insert">
          <Icon size="small" name="image" />
          <Localized id="editor-tools-figure-add-subfigure">
            Add subfigure
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertCaption}
          isDisabled={(figure.nodes.last() as Block).type === 'figure_caption'}
          className="toolbox__button--insert"
        >
          <Icon size="small" name="comment" />
          <Localized id="editor-tools-figure-add-caption">
            Add caption
          </Localized>
        </Button>
        <Classes editor={editor} block={figure} />
        <div>
          <Button clickHandler={this.toggleMediaText}>
            {
              mediaText
                ? <Localized id="editor-tools-figure-remove-media-text">
                  Remove description of text from image
                </Localized>
                : <Localized id="editor-tools-figure-add-media-text">
                  Add description of text from image
                </Localized>
            }
          </Button>
        </div>
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

  private toggleMediaText = () => {
    const { editor, value } = this.props
    const media = editor.getActiveMedia(value)
    if (media) {
      const mediaText = media && media.nodes.find(m => (m as Block).type === 'media_text')
      if (mediaText) {
        editor.removeNodeByKey(mediaText.key)
      } else {
        editor.insertNodeByKey(media.key, 1, {
          object: 'block',
          type: 'media_text',
        } as Block)
      }
    }
  }
}
