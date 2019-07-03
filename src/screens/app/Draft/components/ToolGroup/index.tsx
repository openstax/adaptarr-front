import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Icon from 'src/components/ui/Icon'

import './index.css'

export type Props = {
  title: string,
  toggleState: boolean,
  onToggle: () => any,
}

export default class ToolGroup extends React.Component<Props> {
  render() {
    const { children, title, toggleState: open } = this.props

    return <div className={"toolgroup" + (open ? ' open' : '')}>
      <div className="toolgroup--header" onClick={this.toggle}>
        <Icon size='small' name={open ? 'arrow-down' : 'arrow-right'} />
        <Localized id={title}>{title}</Localized>
      </div>
      <div className="toolgroup--content">
        {children}
      </div>
    </div>
  }

  toggle = (ev: React.MouseEvent) => {
    ev.preventDefault()
    this.props.onToggle()
  }
}
