import { BooksMap, IsLoading } from 'src/store/types'
import { BooksAction } from 'src/store/actions/books'
import {
  FETCH_BOOKS_MAP_BEGIN,
  FETCH_BOOKS_MAP_FAILURE,
  FETCH_BOOKS_MAP_SUCCESS,
} from 'src/store/constants'

export interface State {
  isLoading: IsLoading
  booksMap: BooksMap
  error?: string
}

// Define our initialState
export const initialState: State = {
  isLoading: true,
  booksMap: new Map(),
}

// eslint-disable-next-line default-param-last
export function reducer(state: State = initialState, action: BooksAction) {
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

  default:
    return state
  }
}
