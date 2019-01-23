import * as React from 'react'
import { Editor, Value } from 'slate'

import AdmonitionTools from '../AdmonitionTools'
import ExerciseTools from '../ExerciseTools'
import FigureTools from '../FigureTools'
import FormatTools from '../FormatTools'
import InsertTools from '../InsertTools'
import ListTools from '../ListTools'
import SaveButton from '../SaveButton'

import './index.css'

export type Props = {
  value: Value,
  editor: Editor,
}

export default function Toolbox({ editor, value }: Props) {
  const { selection } = value

  if (!selection.isSet) {
    return (
      <div className="toolbox">
        No selection
      </div>
    )
  }

  if (selection.start.key !== selection.end.key) {
    return (
      <div className="toolbox">
        Selection across elements is not yet supported.
      </div>
    )
  }

  return (
    <div className="toolbox">
      <SaveButton value={value} />
      <FormatTools editor={editor} value={value} />
      <InsertTools editor={editor} value={value} />

      <AdmonitionTools editor={editor} value={value} />
      <ExerciseTools editor={editor} value={value} />
      <FigureTools editor={editor} value={value} />
      <ListTools editor={editor} value={value} />
    </div>
  )
}
