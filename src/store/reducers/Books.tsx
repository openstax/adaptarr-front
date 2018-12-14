import { IsLoading, BooksMap } from 'src/store/types'
import { BooksAction } from 'src/store/actions/Books'
import {
  FETCH_BOOKS_MAP_BEGIN,
  FETCH_BOOKS_MAP_SUCCESS,
  FETCH_BOOKS_MAP_FAILURE,
} from 'src/store/constants'

export interface State {
  isLoading: IsLoading
  booksMap: BooksMap
  error?: string
}

// Define our initialState
export const initialState: State = {
  isLoading: true,
  booksMap: new Map()
}

export function reducer (state: State = initialState, action: BooksAction) {
  switch (action.type) {
    case FETCH_BOOKS_MAP_BEGIN:
      return {
        ...state,
        isLoading: true,
        booksMap: state.booksMap,
      }
    case FETCH_BOOKS_MAP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        booksMap: action.data,
      }
    case FETCH_BOOKS_MAP_FAILURE:
      return {
        ...state,
        isLoading: false,
        booksMap: new Map(),
        error: action.error,
      }
  }
  return state
}
