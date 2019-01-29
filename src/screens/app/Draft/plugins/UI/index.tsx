import * as React from 'react'
import { Plugin } from 'slate-react'

import Toolbox from '../../components/Toolbox'

const UIPlugin: Plugin = {
  renderEditor({ value }, editor, next) {
    return (
      <React.Fragment>
        {next()}
        <Toolbox editor={editor} value={value} />
      </React.Fragment>
    )
  }
}

export default UIPlugin
