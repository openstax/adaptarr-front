import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Value } from 'slate'

import Button from 'src/components/ui/Button'

import './index.css'

type Props = {
  value: Value
}

class CharactersCounter extends React.Component<Props> {
  state: {
    characters: number
  } = {
    characters: 0,
  }

  public render() {
    return (
      <div className="characters-counter">
        <label className="toolbox__label">
          <span className="toolbox__title">
            <Localized id="editor-tools-characters-counter-title" $value={this.state.characters}>
              Number of characters:
            </Localized>
          </span>
          <Button clickHandler={this.countCharacters}>
            <Localized id="editor-tools-characters-counter-refresh">
              Refresh
            </Localized>
          </Button>
        </label>
      </div>
    )
  }

  private countCharacters = () => {
    const text = this.props.value.document.text.replace(/\s+/g, ' ')
    this.setState({ characters: text.length })
  }
}

export default CharactersCounter
