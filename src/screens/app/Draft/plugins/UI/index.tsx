import * as React from 'react'
import { Plugin } from 'slate-react'

const UIPlugin: Plugin = {
  renderEditor({ value }, editor, next) {
    return <>
      <div className="document">
        {next()}
      </div>
    </>
  }
}

export default UIPlugin
