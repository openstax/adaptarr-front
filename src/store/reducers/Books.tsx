import { BooksMap } from '../types'
import { BooksAction } from '../actions/Books'
import {
  SET_BOOKS_MAP,
} from '../constants'

export interface State {
  booksMap: BooksMap
}

// Define our initialState
export const initialState: State = {
  booksMap: new Map()
}

export function reducer (state: State = initialState, action: BooksAction) {
  switch (action.type) {
    case SET_BOOKS_MAP:
      return {
        ...state,
        booksMap: action.data,
      }
  }
  return state
}
