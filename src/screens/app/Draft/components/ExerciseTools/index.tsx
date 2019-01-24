import * as React from 'react'
import { Trans } from 'react-i18next'
import { Block, Editor, Value } from 'slate'
import { EditorAug } from 'cnx-designer'

import Button from 'src/components/ui/Button'

import ToolGroup from '../ToolGroup'

export type Props = {
  editor: Editor,
  value: Value,
}

export default class ExerciseTools extends React.Component<Props> {
  render() {
    const { editor, value } = this.props
    const exercise = (editor as EditorAug).getActiveExercise(value)

    return exercise && (
      <ToolGroup title="Editor.exercise.groupTitle">
        <Button clickHandler={this.insertSolution}>
          <Trans i18nKey="Editor.exercise.insert.solution" />
        </Button>
        <Button
          clickHandler={this.insertCommentary}
          isDisabled={(exercise.nodes.last() as Block).type === 'exercise_commentary'}
          >
          <Trans i18nKey="Editor.exercise.insert.commentary" />
        </Button>
      </ToolGroup>
    )
  }

  private insertSolution = () => (this.props.editor as EditorAug).insertSolution()
  private insertCommentary = () => (this.props.editor as EditorAug).insertCommentary()
}
