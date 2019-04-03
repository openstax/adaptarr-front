import './index.css'

import * as React from 'react'

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

  choices = {
    default: 'Default',
    webview: 'Webview',
    pdf: 'PDF',
  }

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
            Object.entries(this.choices).map(([key, label]: [string, string]) => (
              <li
                key={key}
                className={`style-switcher__choice ${style === key ? 'active' : ''}`}
                data-choice={key}
                onClick={this.onClick}
              >
                {label}
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default StyleSwitcher
