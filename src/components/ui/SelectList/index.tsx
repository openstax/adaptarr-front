import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Icon from 'src/components/ui/Icon'

import './index.css'

export type OptionType = {
  id: number
  [key: string]: any
}

export type SelectListProps = {
  showSelectAllOption?: boolean
  classes?: { list?: string, item?: string }
  closeAfterSelect?: boolean
  multiple?: boolean
  isListOpen?: boolean
  options: OptionType[]
  selected?: Set<number> | number[]
  formatOption: (option: any) => JSX.Element
  onChange: (ids: Set<number>) => void
}

type SelectListState = {
  isListOpen: boolean
  selected: Set<number>
}

class SelectList extends React.Component<SelectListProps> {
  state: SelectListState = {
    isListOpen: true,
    selected: new Set(),
  }

  public open() {
    this.setState({ isListOpen: true })
  }

  public close() {
    this.setState({ isListOpen: false })
  }

  componentDidUpdate(prevProps: SelectListProps) {
    if (!compareSelected(prevProps.selected, this.props.selected)) {
      let selected = this.props.selected
      if (selected instanceof Array) {
        selected = new Set(selected)
      }
      this.setState({ selected })
    }
    if (prevProps.isListOpen !== this.props.isListOpen) {
      this.setState({ isListOpen: this.props.isListOpen })
    }
  }

  componentDidMount() {
    let { selected = new Set(), isListOpen = true } = this.props
    if (selected instanceof Array) {
      selected = new Set(selected)
    }
    this.setState({ selected, isListOpen })
  }

  public render() {
    const { options, classes, formatOption, showSelectAllOption = false } = this.props
    const { selected, isListOpen } = this.state

    if (!isListOpen) return null

    let listClass = 'select-list'
    let itemClass = 'select-list__item'
    if (classes) {
      if (classes.list) {
        listClass += ' ' + classes.list
      }
      if (classes.item) {
        itemClass += ' ' + classes.item
      }
    }

    return (
      <ul className={listClass}>
        {
          showSelectAllOption ?
            <li
              className={selected.size === options.length ? `${itemClass} selected` : itemClass}
              onClick={this.toggleAll}
            >
              <span className="select-list__option">
                <Localized id="select-list-select-all">
                  Select all
                </Localized>
              </span>
              {
                selected.size === options.length ?
                  <span className="select-list__selected">
                    <Icon size="small" name="check-simple" />
                  </span>
                : null
              }
            </li>
          : null
        }
        {
          options.map(op => {
            const isSelected = selected.has(op.id)
            return (
              <li
                key={op.id}
                className={isSelected ? `${itemClass} selected` : itemClass}
                onClick={this.onClick}
                data-id={op.id}
              >
                <span className="select-list__option">
                  {formatOption(op)}
                </span>
                {
                  isSelected ?
                    <span className="select-list__selected">
                      <Icon size="small" name="check-simple" />
                    </span>
                  : null
                }
              </li>
            )
          })
        }
      </ul>
    )
  }

  private toggleAll = () => {
    let selected: Set<number>

    if (this.state.selected.size === this.props.options.length) {
      selected = new Set()
    } else {
      selected = new Set(this.props.options.map(op => op.id))
    }

    let newState = {
      selected,
      isListOpen: this.props.closeAfterSelect ? false : true,
    }

    this.setState(newState, () => {
      this.props.onChange(selected)
    })
  }

  private onClick = (ev: React.MouseEvent) => {
    const id = Number((ev.currentTarget as HTMLLIElement).dataset.id)
    const { multiple = true, closeAfterSelect = true } = this.props
    let { selected } = this.state

    if (selected.has(id)) {
      selected.delete(id)
    } else {
      if (multiple) {
        selected.add(id)
      } else {
        selected = new Set([id])
      }
    }

    let newState = {
      selected,
      isListOpen: closeAfterSelect ? false : true,
    }

    this.setState(newState, () => {
      this.props.onChange(selected)
    })
  }
}

export default SelectList

type SelectedValue = Set<number> | number[] | undefined

/**
 * Compare values. Return true if there are same and false if they are not.
 */
function compareSelected(val1: SelectedValue, val2: SelectedValue) {
  if (val1 instanceof Array && val2 instanceof Array) {
    if (val1.length !== val2.length) return false
    for (let i = 0; i < val1.length; i++) {
      if (val1[i] !== val2[i]) return false
    }
    return true
  }
  if (val1 instanceof Set && val2 instanceof Set) {
    if (val1.size !== val2.size) return false
    for (let val of val1.values()) {
      if (!val2.has(val)) return false
    }
    return true
  }
  return false
}
