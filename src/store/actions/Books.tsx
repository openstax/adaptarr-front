import axios from 'src/config/axios'

import * as constants from 'src/store/constants'
import { BooksMap, BookShortInfo } from 'src/store/types'

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

const fetchBooksMapBegin = (): FetchBooksMapBegin => {
  return {
    type: constants.FETCH_BOOKS_MAP_BEGIN,
  }
}

const fetchBooksMapSuccess = (payload: BooksMap): FetchBooksMapSuccess => {
  return {
    type: constants.FETCH_BOOKS_MAP_SUCCESS,
    data: payload,
  }
}

const fetchBooksMapFailure = (payload: string): FetchBooksMapFailure => {
  return {
    type: constants.FETCH_BOOKS_MAP_FAILURE,
    error: payload,
  }
}

export const fetchBooksMap = (): FetchBooksMap => {
  return (dispatch: React.Dispatch<BooksAction>) => {
    dispatch(fetchBooksMapBegin())

    axios.get('books')
      .then(res => {
        dispatch(fetchBooksMapSuccess(new Map(res.data.map((book: BookShortInfo) => [book.id, book]))))
      })
      .catch(e => {
        dispatch(fetchBooksMapFailure(e.message))
        throw new Error(e.message)
      })
  }
}
