import * as React from 'react'
import { connect } from 'react-redux'
import { Editor, InlineProperties, Value } from 'slate'
import { Localized } from 'fluent-react/compat'

import { User } from 'src/api'

import { State } from 'src/store/reducers'

import Button from 'src/components/ui/Button'

import ToolGroup from '../ToolGroup'
import { OnToggle as OnToggleDocument } from '../ToolboxDocument'
import { OnToggle as OnToggleGlossary } from '../ToolboxGlossary'

import { HIGHLIGHT_COLORS, HighlightColor } from '../../plugins/Highlights/schema'

import './index.css'

interface HighlightToolsProps {
  editor: Editor
  value: Value
  toggleState: boolean
  onToggle: OnToggleDocument | OnToggleGlossary
  user: User
}

const mapStateToProps = ({ user: { user } }: State) => ({
  user,
})

const HighlightTools = (props: HighlightToolsProps) => {
  const highlight = props.editor.getActiveHighlight(props.value)

  if (!highlight) return null

  const onClickToggle = () => {
    props.onToggle('highlightTools')
  }

  const onColorChange = (color: HighlightColor) => {
    props.editor.setNodeByKey(
      highlight.key,
      { data: highlight.data.set('color', color) } as InlineProperties
    )
  }

  const removeHighlight = () => {
    props.editor.unwrapInlineByKey(highlight.key, 'highlight')
  }

  return (
    <ToolGroup
      title="editor-tools-highlight-title"
      toggleState={props.toggleState}
      onToggle={onClickToggle}
    >
      {
        props.user.id === highlight.data.get('user')
          ?
          <div className="color-picker">
            {
              HIGHLIGHT_COLORS.map(color => (
                <Color
                  key={color}
                  isActive={highlight.data.get('color') === color}
                  color={color}
                  onSelect={onColorChange}
                />
              ))
            }
          </div>
          : null
      }
      <Button clickHandler={removeHighlight}>
        <Localized id="editor-tools-highlight-remove">
          Remove highlight
        </Localized>
      </Button>
    </ToolGroup>
  )
}

export default connect(mapStateToProps)(HighlightTools)

interface ColorProps {
  isActive: boolean
  color: HighlightColor
  onSelect: (color: HighlightColor) => void
}

const Color = ({ isActive, color, onSelect }: ColorProps) => {
  const onClick = () => {
    if (isActive) return
    onSelect(color)
  }

  const classes = ['color-picker__item', `highlight--${color}`]
  if (isActive) {
    classes.push('color-picker__item--active')
  }

  return <div className={classes.join(' ')} onClick={onClick} />
}
