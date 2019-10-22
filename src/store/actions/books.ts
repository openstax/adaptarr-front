import { Book } from 'src/api'

import * as constants from 'src/store/constants'
import { BooksMap } from 'src/store/types'

export interface FetchBooksMap {
  (dispatch: any): void
}

export interface FetchBooksMapBegin {
  type: constants.FETCH_BOOKS_MAP_BEGIN,
}

export interface FetchBooksMapSuccess {
  type: constants.FETCH_BOOKS_MAP_SUCCESS,
  data: BooksMap,
}

export interface FetchBooksMapFailure {
  type: constants.FETCH_BOOKS_MAP_FAILURE,
  error: string,
}

export type BooksAction = FetchBooksMapBegin | FetchBooksMapSuccess | FetchBooksMapFailure

const fetchBooksMapBegin = (): FetchBooksMapBegin => ({
  type: constants.FETCH_BOOKS_MAP_BEGIN,
})

const fetchBooksMapSuccess = (payload: BooksMap): FetchBooksMapSuccess => ({
  type: constants.FETCH_BOOKS_MAP_SUCCESS,
  data: payload,
})

const fetchBooksMapFailure = (payload: string): FetchBooksMapFailure => ({
  type: constants.FETCH_BOOKS_MAP_FAILURE,
  error: payload,
})

export const fetchBooksMap = (): FetchBooksMap => (dispatch: React.Dispatch<BooksAction>) => {
  dispatch(fetchBooksMapBegin())

  Book.all()
    .then(books => {
      dispatch(fetchBooksMapSuccess(new Map(
        books.map((book: Book): [string, Book] => [book.id, book])
      )))
    })
    .catch(e => {
      dispatch(fetchBooksMapFailure(e.message))
      throw new Error(e.message)
    })
}
