import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Block, Document, Editor, Node } from 'slate'
import { Map } from 'immutable'

import * as api from 'src/api'
import { ReferenceTarget, ReferenceTargetType } from 'src/store/types'

import { ReferenceTargetWithLabel } from 'src/components/ReferenceTarget'
import ReferenceTargets from 'src/containers/ReferenceTargets'

/**
 * Mapping from Slate block types to reference target types, where they differ.
 */
const TYPE_MAP: { [key: string]: ReferenceTargetType } = {
  exercise_commentary: 'commentary',
  exercise_solution: 'solution',
  subfigure: 'figure',
}

export type Props = {
  /**
   * Editor session for the document for which to display reference targets.
   */
  editor: Editor,
  /**
   * Function to call when user selects a reference target.
   */
  onSelect: (target: ReferenceTarget, source: api.Module | null) => void,
}

/**
 * Display list of reference targets in an editor session.
 */
export default class LocalResourceTargets extends React.PureComponent<Props> {
  static contextTypes = {
    counters: PropTypes.instanceOf(Map as any),
  }

  render() {
    const { editor, onSelect } = this.props
    const targets = Array.from(this.mapBlockToTargets(editor.value.document))

    return (
      <ReferenceTargets
        module={null}
        targets={targets}
        onSelect={onSelect}
        />
    )
  }

  private *mapBlockToTargets(block: Block | Document): IterableIterator<ReferenceTargetWithLabel> {
    for (const child of block.nodes as unknown as Iterable<Node>) {
      if (child.object !== 'block') continue

      let description = null

      switch (child.type) {
      case 'example':
      case 'exercise_commentary':
      case 'exercise_solution':
      case 'note':
        description = child.nodes.first().text
        break

      case 'figure':
        if ((child.nodes.last() as Block).type === 'caption') {
          description = child.nodes.last().text
        }
        break

      case 'exercise':
        description = (child.nodes.first() as Block).nodes.first().text
        break

      default:
        continue
      }

      const counters = this.context.counters.get(child.key)
      const label = this.props.editor.run('renderXRef', child, counters) as unknown as string

      const target: ReferenceTargetWithLabel = {
        id: child.key,
        type: TYPE_MAP[child.type] || child.type,
        description,
        label,
        counter: counters.get(child.type) || 0,
        children: [],
      }

      switch (child.type) {
      case 'exercise':
      case 'figure':
        target.children = Array.from(this.mapBlockToTargets(child))
        yield target
        break

      default:
        yield target
        yield* this.mapBlockToTargets(child)
      }
    }
  }
}
