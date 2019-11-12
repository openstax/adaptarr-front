import * as React from 'react'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import NodeAttribute from '../NodeAttribute'

import { OnToggle } from '../ToolboxDocument'

interface VideoToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

const VideoTools = ({ editor, value: { startBlock }, toggleState, onToggle }: VideoToolsProps) => {
  const video = startBlock && startBlock.type === 'video' ? startBlock : null

  const onClickToggle = () => {
    onToggle('videoTools')
  }

  return video && (
    <ToolGroup
      title="editor-tools-video-title"
      toggleState={toggleState}
      className="video-tools"
      onToggle={onClickToggle}
    >
      <NodeAttribute editor={editor} node={video} attribute="for" />
      <NodeAttribute editor={editor} node={video} attribute="standby" />
      <NodeAttribute editor={editor} node={video} attribute="autoplay" />
      <NodeAttribute editor={editor} node={video} attribute="loop" />
      <NodeAttribute editor={editor} node={video} attribute="controller" />
      <NodeAttribute editor={editor} node={video} attribute="volume" />
      <NodeAttribute editor={editor} node={video} attribute="height" />
      <NodeAttribute editor={editor} node={video} attribute="width" />
      <NodeAttribute editor={editor} node={video} attribute="longdesc" />
    </ToolGroup>
  )
}

export default VideoTools
