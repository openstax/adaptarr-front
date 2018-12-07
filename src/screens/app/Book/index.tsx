import * as React from 'react'
import Nestable from 'react-nestable'
import { connect } from 'react-redux'
import { AxiosResponse } from 'axios'

import axios from '../../../config/axios'

import Section from '../../../components/Section'
import Header from '../../../components/Header'
import Avatar from '../../../components/ui/Avatar'

import * as types from '../../../store/types'
import { State } from '../../../store/reducers'

type Props = {
  match: {
    params: {
      id: string
    }
  }
  team: {
    teamMap: types.TeamMap
  }
  modulesMap: {
    modulesMap: types.ModulesMap
  }
}

const mapStateToProps = ({ team, modulesMap }: State) => {
  return {
    team,
    modulesMap,
  }
}

// Nested component is adding `parts: []` to every item and we do not want that
const listWithoutEmptyParts = (arr: types.BookPart[]): types.BookPart[] => {
  const removeEmptyPartsFromItem = (item: types.BookPart): types.BookPart => {
    if (item.parts && item.parts.length === 0) {
      const newItem = Object.assign({}, {...item})
      delete newItem.parts
      return newItem
    }
  
    return item
  }
  
  return arr.map((item: types.BookPart) => {
    if (item.parts && item.parts.length > 0) {
      return {
        ...item,
        parts: listWithoutEmptyParts(item.parts)
      }
    } else {
      return removeEmptyPartsFromItem(item)
    }
  })
}

class Book extends React.Component<Props> {
  state: {
    isLoading: boolean,
    book: types.Book,
  } = {
    isLoading: true,
    book: {
      id: 'loading',
      title: 'Loading...',
      parts: []
    },
  }

  private renderItem = ({ item, collapseIcon }: { item: types.BookPart, index: number, collapseIcon: any, handler: any }) => {
    const { modulesMap } = this.props.modulesMap
    const { teamMap } = this.props.team
    let user

    if (item.kind === 'module') {
      const mod = modulesMap.get(item.id)
      const assigne = mod ? mod.assignee : undefined
      user = assigne ? teamMap.get(assigne) : undefined
    }

    let classes = ['bookpart__item', `bookpart__item--${item.kind}`]
    return (
      <div className={classes.join(' ')}>
        {
          item.kind === 'part' ?
            <span className="bookpart__icon">
              {collapseIcon}
            </span>
          : null
        }
        <span className="bookpart__title">{item.title}</span>
        {
          item.kind === 'module' && user ?
            <Avatar size="small" user={user} />
          : null
        }
      </div>
    )
  }

  private findParentWithinItems = (items: types.BookPart[], path: number[]) => {
    let pathToParent = [...path]
    pathToParent.pop() // remove last index because it's pointing to changedItem

    let parent: types.BookPart | types.Book

    if (pathToParent.length === 0) {
      parent = this.state.book
    } else {
      parent = items[pathToParent[0]]
      pathToParent.shift()

      // If there are still some indexes then process them
      if (pathToParent.length > 0) {
        pathToParent.forEach(index => {
          if (parent && parent.parts && parent.parts[index]) {
            parent = parent.parts[index]
          } else {
            throw new Error(`Couldn't find parent for item at path: ${JSON.stringify(path)}`)
          }
        })
      } 
    }

    return parent
  }

  private handleOnMove = (newItems: types.BookPart[], changedItem: types.BookPart, realPathTo: number[]) => {
    // Do not move bookparts into modules
    // TODO: Create new part when user move module into module
    const parent: types.BookPart | types.Book = this.findParentWithinItems(newItems, realPathTo)

    if ((parent as types.BookPart).kind && (parent as types.BookPart).kind === 'module') {
      console.log('You can not move modules into modules.')
      return false
    }
    
    return true
  }

  private handlePositionChange = (newItems: types.BookPart[], changedItem: types.BookPart, realPathTo: number[]) => {
    this.setState({
      book: {
        ...this.state.book,
        parts: listWithoutEmptyParts(newItems),
      }
    })
  }

  private fetchBook = (id: string) => {
    axios.get(`books/${id}`)
      .then((res: AxiosResponse) => {
        this.setState({
          isLoading: false,
          book: res.data,
        })
      })
      .catch((e: ErrorEvent) => {
        console.log(e.message)
        this.setState({isLoading: false})
      })
  }

  componentDidMount () {
    this.fetchBook(this.props.match.params.id)
  }
  
  public render() {
    const { book } = this.state

    return (
      <div className="container container--splitted">
        <Section>
          <Header title={book.title} />
          <div className="section__content">
            {/*<div style={{width: '100%'}}>
              <pre>{JSON.stringify(book.parts, undefined, 2)}</pre>
            </div>*/}
            <Nestable
              isDisabled={false}
              items={book.parts}
              className="book-collection"
              childrenProp="parts"
              renderItem={this.renderItem}
              onMove={this.handleOnMove}
              onChange={this.handlePositionChange}
            />
          </div>
        </Section>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Book)
