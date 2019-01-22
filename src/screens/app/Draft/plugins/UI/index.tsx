import * as React from 'react'
import { Plugin } from 'slate-react'

import Toolbox from '../../components/Toolbox'

const UIPlugin: Plugin = {
  renderEditor({ value }, editor, next) {
    return <>
      <div className="document">
        {next()}
      </div>
      <Toolbox editor={editor} value={value} />
    </>
  }
}

export default UIPlugin
