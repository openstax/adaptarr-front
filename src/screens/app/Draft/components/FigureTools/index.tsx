import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Block, Editor, Value } from 'slate'

import { FileDescription } from 'src/api/storage'

import Modal from 'src/components/Modal'
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

  private onClickToggle = () => {
    this.props.onToggle('figureTools')
  }

  render() {
    const { editor, value } = this.props
    const figure = editor.getActiveFigure(value)

    if (figure === null) return null

    // This will return figure if there is no subfigure
    const subfigure = editor.getActiveSubfigure(value)

    return (
      <ToolGroup
        title="editor-tools-figure-title"
        toggleState={this.props.toggleState}
        onToggle={this.onClickToggle}
      >
        {
          figure !== subfigure &&
          <Button clickHandler={this.removeSubfigure} className="toolbox__button--insert">
            <Icon size="small" name="close" />
            <Localized id="editor-tools-figure-remove-subfigure">
              Remove subfigure
            </Localized>
          </Button>
        }
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
      onSelect={this.onAssetSelected}
    />
  )

  private insertSubfigure = () => {
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
    this.props.editor.insertSubfigure({
      ...asset,
      alt: '',
    })
  }
}
