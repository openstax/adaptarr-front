import * as React from 'react'
import Nestable from 'react-nestable'
import { AxiosResponse } from 'axios'

import axios from '../../../config/axios'

import Section from '../../../components/Section'
import Header from '../../../components/Header'

import * as types from '../../../store/types'

type Props = {
  match: {
    params: {
      id: string
    }
  }
}

const renderItem = ({ item, collapseIcon }: { item: types.BookPart, index: number, collapseIcon: any, handler: any }) => {
  return (
    <div className="bookpart__item">
      <span className="bookpart__icon">
        {collapseIcon}
      </span>
      {
        item.kind == 'part' ?
          <h2 className="bookpart__title bookpart__title--chapter">{item.title}</h2>
        :
          <h3 className="bookpart__title bookpart__title--module">{item.title}</h3>
      }
    </div>
  )
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
      parts: [
        {
          "kind":"module",
          "id":"66df3c1s4-44f8-4a0c-8a44-b4671f6a08a7",
          "title":"1. Rise and Fall of Jabba the Hutt"
        },
        {
          "kind":"part",
          "id":"6f0e5297-e64e-43fdfga-b434-4ef26ab3766a",
          "title":"2. Notable Figures",
          "parts":[
            {
              "kind":"module",
              "id":"23310344-6bb2-470b-a643-8bb04125e2e5",
              "title":"2.1. The Skywalkers"
            },
            {
              "kind":"module",
              "id":"233120344-6bb2-470b-a643-8bb04125e2e5",
              "title":"2.2. The Skywalkers"
            },
            {
              "kind":"module",
              "id":"233103344-6bb2-470b-a643-8bb04125e2e5",
              "title":"2.3. The Skywalkers"
            }
          ]
        },
        {
          "kind":"part",
          "id":"6f0e529as7-e64e-43fa-b434-4ef26ab3766a",
          "title":"3. Notable Figures",
          "parts":[
            {
              "kind":"module",
              "id":"23310344-6b4b2-470b-a643-8bb04125e2e5",
              "title":"3.1. The Skywalkers"
            },
            {
              "kind":"module",
              "id":"233120344-6bb32-470b-a643-8bb04125e2e5",
              "title":"3.2. The Skywalkers"
            },
            {
              "kind":"module",
              "id":"233103344-6b2b2-470b-a643-8bb04125e2e5",
              "title":"3.3. The Skywalkers"
            }
          ]
        }
      ],
    },
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
      <Section>
        <Header title={book.title} />
        <div className="section__content">
          {/*<div style={{width: '100%'}}>
            <pre>{JSON.stringify(book.parts, undefined, 2)}</pre>
          </div>*/}
          <Nestable
            isDisabled={false}
            items={book.parts}
            childrenProp="parts"
            renderItem={renderItem}
            onMove={this.handleOnMove}
            onChange={this.handlePositionChange}
          />
        </div>
      </Section>
    )
  }
}

export default Book
