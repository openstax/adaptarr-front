import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Icon from 'src/components/ui/Icon'
import Button from 'src/components/ui/Button'

type Props = {
  onChange: (style: string) => any
}

class StyleSwitcher extends React.Component<Props> {
  state: {
    style: string
    open: boolean
  } = {
    style: 'default',
    open: false,
  }

  styles = ['default', 'webview', 'pdf']

  private toggleSwitcher = () => {
    this.setState({ open: !this.state.open })
  }

  private onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const choice = (e.target as HTMLUListElement).dataset.choice

    if (!choice) return

    this.setState({ style: choice })
    this.props.onChange('editor--' + choice)
    this.setState({ open: false })
  }

  public render() {
    const { style, open } = this.state

    return (
      <div className={`style-switcher ${open ? 'open' : 'close'}`}>
        <Button clickHandler={this.toggleSwitcher}>
          <Icon name="cog" />
        </Button>
        <ul>
          {
            this.styles.map(choice => (
              <li
                key={choice}
                className={`style-switcher__choice ${style === choice ? 'active' : ''}`}
                data-choice={choice}
                onClick={this.onClick}
              >
                <Localized id="draft-style-switcher" $style={choice}>
                  {choice}
                </Localized>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default StyleSwitcher
