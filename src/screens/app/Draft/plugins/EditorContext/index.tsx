import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Storage } from 'cnx-designer'

type Props = {
  storage: Storage,
  mediaUrl: (name: string) => string
}

/**
 * Provide current {@link Storage} and {@param mediaUrl} as a React context for easy access by node
 * components.
 */
export default class EditorContext extends React.Component<Props> {
  static childContextTypes = {
    storage: PropTypes.instanceOf(Storage),
    mediaUrl: PropTypes.instanceOf(Function)
  }

  getChildContext() {
    return {
      storage: this.props.storage,
      mediaUrl: this.props.mediaUrl,
    }
  }

  render() {
    return <React.Fragment>
      {this.props.children}
    </React.Fragment>
  }
}
