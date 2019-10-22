import { Plugin } from 'slate-react'

import onKeyDown from './handlers'

const Shortcuts = (options?: any): Plugin => ({
  onKeyDown,
} as unknown as Plugin)

export default Shortcuts
