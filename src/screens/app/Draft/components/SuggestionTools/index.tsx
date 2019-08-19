import * as React from 'react'
import { Editor, Value, Inline } from 'slate'
import { Localized } from 'fluent-react/compat'
import { connect } from 'react-redux'

import { SlotPermission } from 'src/api/process'

import { State } from 'src/store/reducers'

import { SUGGESTION_TYPES } from '../../plugins/Suggestions/types'

import SuggestionBox from './SuggestionBox'
import ToolGroup from '../ToolGroup'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import { OnToggle as OnToggleDocument } from '../ToolboxDocument'
import { OnToggle as OnToggleGlossary } from '../ToolboxGlossary'

import './index.css'

type Props = {
  editor: Editor,
  value: Value,
  toggleState: boolean,
  onToggle: OnToggleDocument | OnToggleGlossary,
  draftPermissions: SlotPermission[]
}

const mapStateToProps = ({ draft: { currentDraftPermissions } }: State) => {
  return {
    draftPermissions: currentDraftPermissions,
  }
}

export type SuggestionInsert = {
  type: 'insert'
  insert: Inline
}

export type SuggestionDelete = {
  type: 'delete'
  delete: Inline
}

export type SuggestionChange = {
  type: 'change'
  insert: Inline
  delete: Inline
  start: {
    key: string
    offset: number
  },
  end: {
    key: string
    offset: number
  },
}

export type Suggestion = SuggestionInsert | SuggestionDelete | SuggestionChange

type LocaleState = {
  suggestion: Suggestion | undefined,
  suggestions: Suggestion[],
  activeIndex: number,
}

class SuggestionsTools extends React.Component<Props> {
  state: LocaleState = {
    suggestion: undefined,
    suggestions: [],
    activeIndex: 0,
  }

  componentDidUpdate = (prevProps: Props) => {
    if (
      prevProps.value.selection.start.key !== this.props.value.selection.start.key
      || prevProps.value.selection.start.offset !== this.props.value.selection.start.offset
      ) {
      const { value: { document, startInline } } = this.props

      const inlines: Inline[] = document.filterDescendants(
        n => n.object === 'inline' && SUGGESTION_TYPES.includes(n.type)
      ).toArray() as Inline[]

      let suggestions: Suggestion[] = []

      inlines.forEach(inl => {
        const lastSuggInx = suggestions.length-1
        const lastSugg = suggestions[lastSuggInx]

        switch (inl.type) {
          case 'suggestion_insert': {
            const suggInsert: SuggestionInsert = {
              type: 'insert',
              insert: inl,
            }

            if (lastSugg && lastSugg.type === 'delete') {
              const change = this.createChangeSuggestion(lastSugg, suggInsert)
              if (change) {
                suggestions[lastSuggInx] = change
                break
              }
            }
            suggestions.push(suggInsert)
            break
          }
          case 'suggestion_delete': {
            const suggDelete: SuggestionDelete = {
              type: 'delete',
              delete: inl,
            }

            if (lastSugg && lastSugg.type === 'insert') {
              const change = this.createChangeSuggestion(lastSugg, suggDelete)
              if (change) {
                suggestions[lastSuggInx] = change
                break
              }
            }
            suggestions.push(suggDelete)
            break
          }
          default:{
            break
          }
        }
      })

      let activeIndex = this.state.activeIndex

      const selectionKey = startInline ? startInline.key : ''
      const newIndex = !selectionKey ? -1 : suggestions.findIndex(sugg => {
        switch (sugg.type) {
          case 'change':
            if (
              sugg.insert.key === selectionKey
              || sugg.delete.key === selectionKey
            ) {
              return true
            }
            return false

          case 'insert':
            if (sugg.insert.key === selectionKey) {
              return true
            }
            return false

          case 'delete':
            if (sugg.delete.key === selectionKey) {
              return true
            }
            return false

          default:
            return false
        }
      })

      if (newIndex >= 0) {
        activeIndex = newIndex
      }

      this.setState({ suggestions, activeIndex })
    }
  }

  /**
   * Merge SuggestionInline with SuggestionDelete and create SuggestionChange.
   * This will return null if provided suggestions can't be merged, because they
   * are not valid siblings.
   */
  private createChangeSuggestion = (
    prevSugg: SuggestionInsert | SuggestionDelete,
    sugg: SuggestionInsert | SuggestionDelete): SuggestionChange | null  => {
    if (prevSugg.type === sugg.type) return null

    const { document } = this.props.value
    const prevSuggInline = prevSugg.type === 'insert' ? prevSugg.insert : prevSugg.delete
    const suggInline = sugg.type === 'insert' ? sugg.insert : sugg.delete
    let suggPrevSibling = document.getPreviousSibling(document.getPath(suggInline.key))

    // Check if previous sibling of @param sugg is the same Node as @param prevSugg

    if (
      suggPrevSibling && suggPrevSibling.object === 'text'
      && suggPrevSibling.text === ''
    ) {
      // Slate is inserting empty Slate~Text Nodes before / after inlines
      // so we have to check one sibling further.
      suggPrevSibling = document.getPreviousSibling(document.getPath(suggPrevSibling.key))
    }

    if (
      suggPrevSibling && suggPrevSibling.object === 'inline'
      && suggPrevSibling.key === prevSuggInline.key
    ) {
      // We can merge those to SuggestionChange
      const insert = prevSuggInline.type === 'suggestion_insert' ? prevSuggInline : suggInline
      const del = prevSuggInline.type === 'suggestion_delete' ? prevSuggInline : suggInline
      return {
        type: 'change',
        insert: insert,
        delete: del,
        start: {
          key: prevSuggInline.key,
          offset: 0,
        },
        end: {
          key: suggInline.key,
          offset: suggInline.text.length,
        }
      }
    }

    return null
  }

  private acceptAll = () => {
    // Accepting suggestion my change path of the next one
    // so we are accepting all of them starting from the end.
    this.state.suggestions.reverse().forEach(sugg => this.onAccept(sugg))
  }

  private rejectAll = () => {
    // Rejecting suggestion my change path of the next one
    // so we are rejecting all of them starting from the end.
    this.state.suggestions.reverse().forEach(sugg => this.onDecline(sugg))
  }

  render() {
    const { suggestions, activeIndex } = this.state

    return suggestions.length > 0 && (
      <ToolGroup
        title="editor-tools-suggestions-title"
        $counter={suggestions.length}
        toggleState={this.props.toggleState}
        onToggle={() => this.props.onToggle('suggestionsTools')}
      >
        <Button
          className="toolbox__button--only-icon suggestion-box__control"
          clickHandler={this.previousSuggestion}
          isDisabled={activeIndex <= 0}
        >
          <Icon size="small" name="arrow-left" />
        </Button>
        <Button
          className="toolbox__button--only-icon suggestion-box__control"
          clickHandler={this.nextSuggestion}
          isDisabled={activeIndex === suggestions.length - 1}
        >
          <Icon size="small" name="arrow-right" />
        </Button>
        {
          suggestions[activeIndex] ?
            <SuggestionBox
              suggestion={suggestions[activeIndex]}
              onClick={this.selectSuggestion}
              onAccept={this.onAccept}
              onDecline={this.onDecline}
              draftPermissions={this.props.draftPermissions}
            />
          : <Localized id="editor-tools-suggestion-undefined">Undefined suggesiton</Localized>
        }
        <div className="suggestion__controls">
          {
            this.props.draftPermissions.includes('accept-changes') ?
              <Button clickHandler={this.acceptAll}>
                <Localized id="editor-tools-suggestion-accept-all">
                  Accept all
                </Localized>
              </Button>
            : null
          }
          <Button clickHandler={this.rejectAll}>
            <Localized id="editor-tools-suggestion-reject-all">
              Reject all
            </Localized>
          </Button>
        </div>
      </ToolGroup>
    )
  }

  private selectSuggestion = (suggestion: Suggestion) => {
    const editor = this.props.editor

    switch (suggestion.type) {
      case 'insert':
        editor.moveTo(suggestion.insert.key, 0).moveFocusToEndOfInline()
        break

      case 'delete':
        editor.moveTo(suggestion.delete.key, 0).moveFocusToEndOfInline()
        break

      case 'change':
        editor.moveAnchorTo(suggestion.start.key, 0)
        editor.moveFocusTo(suggestion.end.key, suggestion.end.offset)
        break

      default:
        console.error('Unhandled suggestion type in onAccept:', suggestion)
        break
    }
  }

  private onAccept = (suggestion: Suggestion) => {
    const { value: { document }, editor } = this.props

    switch (suggestion.type) {
      case 'insert': {
        const path = document.getPath(suggestion.insert.key)
        editor.unwrapChildrenByPath(path)
        break
      }
      case 'delete': {
        editor.removeNodeByKey(suggestion.delete.key)
        break
      }
      case 'change': {
        const path = document.getPath(suggestion.insert.key)
        editor.withoutNormalizing(() => {
          editor.unwrapChildrenByPath(path)
          editor.removeNodeByKey(suggestion.delete.key)
        })
        break
      }
      default: {
        console.error('Unhandled suggestion type in onAccept:', suggestion)
        break
      }
    }

    this.focusClosestSuggestion()
  }

  private onDecline = (suggestion: Suggestion) => {
    const { value: { document }, editor } = this.props

    switch (suggestion.type) {
      case 'insert': {
        editor.removeNodeByKey(suggestion.insert.key)
        break
      }
      case 'delete': {
        const path = document.getPath(suggestion.delete.key)
        editor.unwrapChildrenByPath(path)
        break
      }
      case 'change': {
        const path = document.getPath(suggestion.delete.key)
        editor.withoutNormalizing(() => {
          editor.unwrapChildrenByPath(path)
          editor.removeNodeByKey(suggestion.insert.key)
        })
        break
      }
      default: {
        console.error('Unhandled suggestion type in onDecline:', suggestion)
        break
      }
    }

    this.focusClosestSuggestion()
  }

  private previousSuggestion = () => {
    const { suggestions, activeIndex } = this.state

    if (activeIndex > 0) {
      const prevSuggestion = suggestions[activeIndex - 1]
      this.selectSuggestion(prevSuggestion)
      this.setState({ activeIndex: activeIndex - 1 })
    }
  }

  private nextSuggestion = () => {
    const { suggestions, activeIndex } = this.state

    if (activeIndex < suggestions.length) {
      const nextSuggestion = suggestions[activeIndex + 1]
      this.selectSuggestion(nextSuggestion)
      this.setState({ activeIndex: activeIndex + 1 })
    }
  }

  private focusClosestSuggestion = () => {
    const { suggestions, activeIndex } = this.state

    if (suggestions[activeIndex + 1]) {
      this.nextSuggestion()
    } else if (suggestions[activeIndex - 1]) {
      this.previousSuggestion()
    }
  }
}

export default connect(mapStateToProps)(SuggestionsTools)
