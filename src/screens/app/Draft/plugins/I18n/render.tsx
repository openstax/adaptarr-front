import * as React from 'react'
import { Editor } from 'slate'
import { EditorProps, RenderNodeProps } from 'slate-react'

import Admonition from '../../components/Admonition'
import Labelled from '../../components/Labelled'
import LabelledWithCounters from '../../components/LabelledWithCounters'
import Caption from '../../components/Caption'

const SOLUTION_COUNTERS = { solution: 'exercise_solution' }

export function renderNode(props: RenderNodeProps, editor: Editor, next: () => any) {
  const { node } = props

  switch (node.type) {
  case 'admonition':
    return <Admonition {...props} />

  case 'exercise':
    return <Labelled
      className="exercise"
      l10nKey="exercise-label"
      {...props}
      />

  case 'exercise_problem':
    return <Labelled
      className="exercise-problem"
      l10nKey="exercise-problem-label"
      {...props}
      />

  case 'exercise_solution':
    return <LabelledWithCounters
      counterMap={SOLUTION_COUNTERS}
      className="exercise-solution"
      l10nKey="exercise-solution-label"
      {...props}
      />

  case 'exercise_commentary':
    return <Labelled
      className="exercise-commentary"
      l10nKey="exercise-commentary-label"
      {...props}
      />

  case 'figure_caption':
    return <Caption {...props} />

  default:
    return next();
  }
}
