import * as React from 'react'
import { Localized } from 'fluent-react/compat'
import { Block, Editor, Value } from 'slate'

import Classes from '../Classes'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import ToolGroup from '../ToolGroup'

import { OnToggle } from '../ToolboxDocument'

export type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggle,
}

export default class ExerciseTools extends React.Component<Props> {
  render() {
    const { editor, value } = this.props
    const exercise = editor.getActiveExercise(value)

    return exercise && (
      <ToolGroup
        title="editor-tools-exercise-title"
        toggleState={this.props.toggleState}
        onToggle={() => this.props.onToggle('exerciseTools')}
      >
        <Button clickHandler={this.insertSolution} className="toolbox__button--insert">
          <Icon size="small" name="check" />
          <Localized id="editor-tools-exercise-insert-solution">
            Add solution
          </Localized>
        </Button>
        <Button
          clickHandler={this.insertCommentary}
          isDisabled={(exercise.nodes.last() as Block).type === 'exercise_commentary'}
          className="toolbox__button--insert"
        >
          <Icon size="small" name="comment" />
          <Localized id="editor-tools-exercise-insert-commentary">
            Add commentary
          </Localized>
        </Button>
        <Classes editor={editor} block={exercise} />
      </ToolGroup>
    )
  }

  private insertSolution = () => this.props.editor.insertSolution()
  private insertCommentary = () => this.props.editor.insertCommentary()
}
