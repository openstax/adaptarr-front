import * as React from 'react'
import { Plugin } from 'slate-react'

import Admonition from '../../components/Admonition'
import Labelled from '../../components/Labelled'
import LabelledWithCounters from '../../components/LabelledWithCounters'
import Caption from '../../components/Caption'

const EXERCISE_COUNTERS = { exercise: 'exercise' }
const SOLUTION_COUNTERS = { exercise: 'exercise', solution: 'exercise_solution' }

const I10nPlugin: Plugin = {
  renderBlock(props, _, next) {
    const { node } = props

    switch (node.type) {
    case 'admonition':
      return <Admonition {...props} />

    case 'exercise':
      return (
        <Labelled
          className="exercise"
          l10nKey="exercise-label"
          {...props}
        />
      )

    case 'exercise_problem':
      return (
        <LabelledWithCounters
          counterMap={EXERCISE_COUNTERS}
          className="exercise-problem"
          l10nKey="exercise-problem-label"
          {...props}
        />
      )

    case 'exercise_solution':
      return (
        <LabelledWithCounters
          counterMap={SOLUTION_COUNTERS}
          className="exercise-solution"
          l10nKey="exercise-solution-label"
          {...props}
        />
      )

    case 'exercise_commentary':
      return (
        <Labelled
          className="exercise-commentary"
          l10nKey="exercise-commentary-label"
          {...props}
        />
      )

    case 'figure_caption':
      return <Caption {...props} />

    case 'media_alt':
      return (
        <Labelled
          className="media__alt"
          l10nKey="media-alt-label"
          textFromUI={true}
          {...props}
        />
      )

    case 'media_text':
      return (
        <Labelled
          className="media__text"
          l10nKey="media-text-label"
          {...props}
        />
      )

    case 'definition':
      return (
        <Labelled
          className="definition"
          l10nKey="definition-label"
          {...props}
        />
      )

    case 'definition_example':
      return (
        <Labelled
          className="definition-example"
          l10nKey="definition-example-label"
          {...props}
        />
      )

    case 'definition_seealso':
      return (
        <Labelled
          className="definition-seealso"
          l10nKey="definition-seealso-label"
          {...props}
        />
      )

    default:
      return next()
    }
  },
}

export default I10nPlugin

