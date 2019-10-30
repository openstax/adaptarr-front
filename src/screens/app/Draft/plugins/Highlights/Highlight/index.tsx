import * as React from 'react'
import { Editor, InlineProperties } from 'slate'
import { RenderInlineProps } from 'slate-react'

import HighlightContent from '../HighlightContent'

interface HighlightProps extends RenderInlineProps {
  slateEditor: Editor
}

const Highlight = ({ node, children, attributes, slateEditor, editor }: HighlightProps) => {
  const [isSelected, setIsSelected] = React.useState(false)

  const onUpdate = (val: string) => {
    editor.setNodeByKey(
      node.key,
      { data: node.data.set('text', val) } as InlineProperties
    ).blur()
  }

  React.useEffect(() => {
    const highlight = slateEditor.getActiveHighlight(editor.value)
    if (highlight && highlight.key === node.key) {
      setIsSelected(true)
      return
    }
    setIsSelected(false)
  }, [editor.value.selection.start.key, editor.value.selection.start.offset])

  return (
    <span className={`highlight highlight--${node.data.get('color')}`} {...attributes}>
      {children}
      {
        isSelected ?
          <HighlightContent
            text={node.data.get('text')}
            creator={Number(node.data.get('user'))}
            onUpdate={onUpdate}
          />
          : null
      }
    </span>
  )
}

export default Highlight
