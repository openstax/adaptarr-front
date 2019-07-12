import './index.css'

import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Icon from 'src/components/ui/Icon'
import Button from 'src/components/ui/Button'
import Dialog from 'src/components/ui/Dialog'

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

  private onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const style = (e.target as HTMLButtonElement).dataset.id

    if (!style) return

    this.setState({ style })
    this.props.onChange('editor--' + style)
    this.setState({ open: false })
  }

  public render() {
    const { style, open } = this.state

    return (
      <div className="style-switcher">
        <Button clickHandler={this.toggleSwitcher} withBorder={true}>
          <Icon size="small" name="cog" />
        </Button>
        {
          open ?
            <Dialog
              size="medium"
              l10nId="draft-style-switcher-title"
              placeholder="Choose style in which you want to display this document"
              onClose={this.toggleSwitcher}
            >
              <div className="dialog__buttons">
                {
                  this.styles.map(s => (
                    <Button
                      key={s}
                      dataId={s}
                      clickHandler={this.onClick}
                      className={s === style ? 'active' : undefined}
                    >
                      <Localized id="draft-style-switcher" $style={s}>
                        {s}
                      </Localized>
                    </Button>
                  ))
                }
              </div>
            </Dialog>
          : null
        }
      </div>
    )
  }
}

export default StyleSwitcher
