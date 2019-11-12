import * as React from 'react'
import { Editor, Value } from 'slate'

import ToolGroup from '../ToolGroup'
import NodeAttribute from '../NodeAttribute'

import { OnToggle } from '../ToolboxDocument'

interface AudioToolsProps {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

const AudioTools = ({ editor, value: { startBlock }, toggleState, onToggle }: AudioToolsProps) => {
  const audio = startBlock && startBlock.type === 'audio' ? startBlock : null

  const onClickToggle = () => {
    onToggle('audioTools')
  }

  return audio && (
    <ToolGroup
      title="editor-tools-audio-title"
      toggleState={toggleState}
      className="audio-tools"
      onToggle={onClickToggle}
    >
      <NodeAttribute editor={editor} node={audio} attribute="for" />
      <NodeAttribute editor={editor} node={audio} attribute="standby" />
      <NodeAttribute editor={editor} node={audio} attribute="autoplay" />
      <NodeAttribute editor={editor} node={audio} attribute="loop" />
      <NodeAttribute editor={editor} node={audio} attribute="controller" />
      <NodeAttribute editor={editor} node={audio} attribute="volume" />
      <NodeAttribute editor={editor} node={audio} attribute="longdesc" />
    </ToolGroup>
  )
}

export default AudioTools
