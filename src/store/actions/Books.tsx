import axios from '../../config/axios'

import * as constants from '../constants'
import { BooksMap, BookShortInfo } from '../types'

export interface FetchBooksMap {
  (dispatch: any): void
}

export interface SetBooksMap {
  type: constants.SET_BOOKS_MAP,
  data: BooksMap,
}

export type BooksAction = SetBooksMap

const setBooksMap = (payload: BooksMap): SetBooksMap => {
  return {
    type: constants.SET_BOOKS_MAP,
    data: payload,
  }
}

export const fetchBooksMap = (): FetchBooksMap => {
  return (dispatch: React.Dispatch<BooksAction>) => {
    axios.get('books')
      .then(res => {
        dispatch(setBooksMap(new Map(res.data.map((book: BookShortInfo) => [book.id, book]))))
      })
      .catch(e => {
        console.log('fetchBooksMap():', e.message)
        throw new Error(e.message)
      })
  }
}
