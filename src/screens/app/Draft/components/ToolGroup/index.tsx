import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Icon from 'src/components/ui/Icon'

import './index.css'

export type Props = {
  title: string,
}

export default class ToolGroup extends React.Component<Props> {
  state: {
    open: boolean,
  } = {
    open: true
  }

  render() {
    const { children, title } = this.props
    const { open } = this.state

    return <div className={"toolgroup" + (open ? ' open' : '')}>
      <div className="toolgroup--header" onClick={this.toggle}>
        <Icon size='small' name={open ? 'arrow-down' : 'arrow-right'} />
        <Localized id={title} />
      </div>
      <div className="toolgroup--content">
        {children}
      </div>
    </div>
  }

  toggle = (ev: React.MouseEvent) => {
    ev.preventDefault()
    this.setState(({ open }: { open: boolean }) => ({ open: !open }))
  }
}
