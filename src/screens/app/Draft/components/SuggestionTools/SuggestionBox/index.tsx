import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Inline } from 'slate'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { Suggestion } from '..'

import './index.css'

type Props = {
  suggestion: Suggestion
  onClick: (suggestion: Suggestion) => any
  onAccept: (suggestion: Suggestion) => any
  onDecline: (suggestion: Suggestion) => any
}

const SuggestionBox = (props: Props) => {
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
    }
    return [insertContent, deleteContent]
  }

  const [insertContent, deleteContent] = getSuggestionContent(props.suggestion)

  const localizedId = `editor-tools-suggestion-${props.suggestion.type}`

  return (
    <div
      className={`suggestion-box`}
      onClick={onClick}
    >
      <div className="suggestion-box__buttons">
        <Button clickHandler={() => props.onAccept(props.suggestion)}>
          <Icon name="check" />
        </Button>
        <Button clickHandler={() => props.onDecline(props.suggestion)}>
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
          <></>
        </Localized>
      </span>
    </div>
  )
}

export default SuggestionBox
