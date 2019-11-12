import * as React from 'react'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import NodeAttribute from '../NodeAttribute'

import { OnToggle } from '../ToolboxDocument'

interface ImageToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

const ImageTools = ({ editor, value: { startBlock }, toggleState, onToggle }: ImageToolsProps) => {
  const image = startBlock && startBlock.type === 'image' ? startBlock : null

  const onClickToggle = () => {
    onToggle('imageTools')
  }

  return image && (
    <ToolGroup
      title="editor-tools-image-title"
      toggleState={toggleState}
      className="image-tools"
      onToggle={onClickToggle}
    >
      <NodeAttribute editor={editor} node={image} attribute="for" />
      <NodeAttribute editor={editor} node={image} attribute="height" />
      <NodeAttribute editor={editor} node={image} attribute="width" />
      <NodeAttribute editor={editor} node={image} attribute="print-width" />
      <NodeAttribute editor={editor} node={image} attribute="thumbnail" />
      <NodeAttribute editor={editor} node={image} attribute="longdesc" />
    </ToolGroup>
  )
}

export default ImageTools
