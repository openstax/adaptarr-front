import { Plugin } from 'slate-react'

import onKeyDown from './handlers'

const Shortcuts = (options?: any): Plugin => {
  return {
    onKeyDown,
  }
}

export default Shortcuts
