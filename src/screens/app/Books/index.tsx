import * as React from 'react'
import { connect } from 'react-redux'

import Section from '../../../components/Section'
import Header from '../../../components/Header'
import BookCard from '../../../components/BookCard'
import Spinner from '../../../components/Spinner'

import { IsLoading, BooksMap, BookShortInfo } from '../../../store/types'
import { State } from '../../../store/reducers/index'

type Props = {
  booksMap: {
    isLoading: IsLoading
    booksMap: BooksMap
  }
}

export const mapStateToProps = ({ booksMap }: State) => {
  return {
    booksMap,
  }
}

class Books extends React.Component<Props> {

  private listOfBookCards = (booksMap: BooksMap) => {
    let books: BookShortInfo[] = []

    // Create new array because we can't render list
    booksMap.forEach(book => {
      books.push(book)
    })

    return books.map((book: BookShortInfo) => {
      return <BookCard key={book.id} book={book}/>
    })
  }

  public render() {
    const { isLoading, booksMap } = this.props.booksMap

    return (
      <Section>
        <Header title={"Books"} />
        {
          !isLoading ?
            <div className="section__content">
              {
                booksMap.size > 0 ?
                  this.listOfBookCards(booksMap)
                : 'No books found.'
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
