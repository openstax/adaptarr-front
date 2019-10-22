import * as React from 'react'
import * as PropTypes from 'prop-types'
import { InjectedProps, ReactLocalization, withLocalization } from 'fluent-react/compat'
import { RenderBlockProps } from 'slate-react'

export interface LabelledProps extends RenderBlockProps {
  className: string
  l10nKey: string
  // Get text from uiL10n. Default is false and then texts from document.ftl file will be loaded.
  textFromUI?: boolean
  args?: object
}

// TODO: Remove legacy context types
// eslint-disable-next-line react/prefer-stateless-function
class Labelled extends React.Component<LabelledProps & InjectedProps> {
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
