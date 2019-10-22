import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Value } from 'slate'

import Button from 'src/components/ui/Button'

import './index.css'

interface CharactersCounterProps {
  value: Value
}

const CharactersCounter = (props: CharactersCounterProps) => {
  const [characters, setCharacters] = React.useState(0)

  const countCharacters = () => {
    const text = props.value.document.text.replace(/\s+/g, ' ')
    setCharacters(text.length)
  }

  return (
    <div className="characters-counter">
      <label className="toolbox__label">
        <span className="toolbox__title">
          <Localized id="editor-tools-characters-counter-title" $value={characters}>
            Number of characters:
          </Localized>
        </span>
        <Button clickHandler={countCharacters}>
          <Localized id="editor-tools-characters-counter-refresh">
            Refresh
          </Localized>
        </Button>
      </label>
    </div>
  )
}

export default CharactersCounter
