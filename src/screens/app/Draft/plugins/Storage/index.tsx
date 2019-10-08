import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Storage } from 'cnx-designer'

/**
 * Provide current {@link Storage} as a React context for easy access by node
 * components.
 */
export default class StorageContext extends React.Component<{storage: Storage}> {
  static childContextTypes = {
    storage: PropTypes.instanceOf(Storage),
  }

  getChildContext() {
    return {
      storage: this.props.storage,
    }
  }

  render() {
    return this.props.children
  }
}
