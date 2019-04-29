import './index.css'

import * as React from 'react'
import { List } from 'immutable'
import { Editor, Block } from 'slate'
import { WithContext as ReactTags } from 'react-tag-input'
import { Localized, withLocalization, GetString } from 'fluent-react/compat'

type Props = {
  editor: Editor,
  block: Block,
  getString: GetString,
}

type Tag = { id: string, text: string }

const KeyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space]

const allowedTypes = [
  'section',
  'table',
  'figure',
  'ul_list',
  'ol_list',
  'exercise',
  'admonition',
]

class ClassName extends React.Component<Props> {
  state: {
    tags: Tag[],
  } = {
    tags: [],
  }

  id = 'input_' + new Date().getTime()

  convertClassesToTags = () => {
    const block = this.props.block

    if (allowedTypes.includes(block.type)) {
      let tags: Tag[] = []
      const classes = block.data.get('class')
      if (classes) {
        tags = Array.from(classes).filter((c: string) => c.length).map((c: string) => {
          return {id: c, text: c}
        })
      }
      this.setState({ tags })
    } else {
      this.setState({ tags: [] })
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.block.key !== this.props.block.key) {
      this.convertClassesToTags()
    }
  }

  componentDidMount() {
    this.convertClassesToTags()
  }

  render() {
    const tags = this.state.tags
    const block = this.props.block

    if (!block) return null

    return (
      <div className="classes" onClick={this.onClick}>
        <span className="classes__title">
          <Localized id="editor-tools-classes-title">
            List of classes
          </Localized>
        </span>
        <ReactTags
          autofocus={false}
          id={this.id}
          tags={tags}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
          placeholder={this.props.getString('editor-tools-classes-placeholder')}
        />
      </div>
    )
  }

  private onClick = () => {
    const input = document.getElementById(this.id) as HTMLInputElement
    input.focus()
  }

  private handleDelete = (i: number) => {
    const { tags } = this.state
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    }, this.handleClassChange)
  }

  private handleAddition = (tag: Tag) => {
    this.setState({ tags: [...this.state.tags, tag] }, this.handleClassChange)
  }

  private handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = [...this.state.tags]

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    this.setState({ tags: newTags }, this.handleClassChange)
  }

  private handleClassChange = () => {
    const { editor, block } = this.props
    const { tags } = this.state

    if (!block) return

    let newElem = {
      ...block.toJS()
    }

    newElem.data.class = List(tags.map(tag => tag.text.replace(/\s/g, '')))

    editor.setNodeByKey(block.key, newElem)
  }
}

export default withLocalization(ClassName)
