import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Inline } from 'slate'

import { SlotPermission } from 'src/api/process'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { Suggestion } from '..'

import './index.css'

interface SuggestionBoxProps {
  suggestion: Suggestion
  draftPermissions: SlotPermission[]
  onClick: (suggestion: Suggestion) => any
  onAccept: (suggestion: Suggestion) => any
  onDecline: (suggestion: Suggestion) => any
}

const SuggestionBox = (props: SuggestionBoxProps) => {
  const onClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.preventDefault()
    props.onClick(props.suggestion)
  }

  const getInlineContent = (inline: Inline) => {
    let content = ""
    inline.nodes.forEach(n => {
      if (!n) return
      if (n.object === 'text') {
        content += n.text
      } else if (n.object === 'inline') {
        if (n.type === 'xref') {
          const target = n.data.get('target')
          const ref = document!.querySelector(`[href="#${target}"]`)
          const refText = ref ? ref.textContent : `[${target}]`
          content += refText
        } else {
          content += n.text
        }
      }
    })
    return content
  }

  const getSuggestionContent = (suggestion: Suggestion): [string, string] => {
    let insertContent = ""
    let deleteContent = ""
    switch (suggestion.type) {
    case 'change':
      insertContent = getInlineContent(suggestion.insert)
      deleteContent = getInlineContent(suggestion.delete)
      break

    case 'insert':
      insertContent = getInlineContent(suggestion.insert)
      break

    case 'delete':
      deleteContent = getInlineContent(suggestion.delete)
      break

    default:
      console.error(`Incorrect suggestion type: ${suggestion}`)
    }
    return [insertContent, deleteContent]
  }

  const [insertContent, deleteContent] = getSuggestionContent(props.suggestion)

  let localizedId = 'editor-tools-suggestion-insert'
  if (props.suggestion.type === 'delete') {
    localizedId = 'editor-tools-suggestion-delete'
  } else if (props.suggestion.type === 'change') {
    localizedId = 'editor-tools-suggestion-change'
  }

  const onAcceptClick = () => {
    props.onAccept(props.suggestion)
  }

  const onDeclineClick = () => {
    props.onDecline(props.suggestion)
  }

  return (
    <div
      className="suggestion-box"
      onClick={onClick}
    >
      <div className="suggestion-box__buttons">
        {
          props.draftPermissions.includes('accept-changes') ?
            <Button clickHandler={onAcceptClick}>
              <Icon name="check" />
            </Button>
            : null
        }
        <Button clickHandler={onDeclineClick}>
          <Icon name="close" />
        </Button>
      </div>
      <span className="suggestion-box__info">
        <Localized
          id={localizedId}
          $insert={insertContent}
          $delete={deleteContent}
          action={<strong/>}
          content={<span/>}
        >
          {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
          <></>
        </Localized>
      </span>
    </div>
  )
}

export default SuggestionBox
