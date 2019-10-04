import * as React from 'react'
import * as PropTypes from 'prop-types'
import { InjectedProps, withLocalization, ReactLocalization } from 'fluent-react/compat'
import { RenderBlockProps } from 'slate-react'

export type Props = RenderBlockProps & {
  className: string
  l10nKey: string
  // Get text from uiL10n. Default is false and then texts from document.ftl file will be loaded.
  textFromUI?: boolean
  args?: object
}

class Labelled extends React.Component<Props & InjectedProps> {
  static contextTypes = {
    uiL10n: PropTypes.instanceOf(ReactLocalization),
  }

  public render() {
    const {
      children,
      className,
      attributes,
      getString,
      node,
      l10nKey,
      textFromUI = false,
      args,
    } = this.props

    let message = ''
    if (textFromUI) {
      message = this.context.uiL10n.getString(l10nKey, args)
    } else {
      message = getString(l10nKey, args)
    }

    return (
      <div
        className={className}
        data-label={message}
        {...attributes}
      >
        {children}
      </div>
    )
  }
}

export default withLocalization(Labelled)
