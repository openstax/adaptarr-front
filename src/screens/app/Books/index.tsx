import * as React from 'react'
import { connect } from 'react-redux'

import Section from '../../../components/Section'
import Header from '../../../components/Header'
import BookCard from '../../../components/BookCard'
import Spinner from '../../../components/Spinner'

import * as types from '../../../store/types'
import { State } from '../../../store/reducers/index'

type Props = {
  booksMap: {
    booksMap: types.BooksMap
  }
}

export const mapStateToProps = ({ booksMap }: State) => {
  return {
    booksMap,
  }
}

class Books extends React.Component<Props> {

  private listOfBookCards = (booksMap: types.BooksMap) => {
    let books: types.BookShortInfo[] = []

    // Create new array because we can't render list
    booksMap.forEach(book => {
      books.push(book)
    })

    return books.map((book: types.BookShortInfo) => {
      return <BookCard key={book.id} book={book}/>
    })
  }

  public render() {
    const { booksMap } = this.props.booksMap

    return (
      <Section>
        <Header title={"Books"} />
        {
          booksMap.size > 0 ?
            <div className="section__content">
              {
                this.listOfBookCards(booksMap)
              }
            </div>
          :
            <Spinner/>
        }
      </Section>
    )
  }
}

export default connect(mapStateToProps)(Books)
