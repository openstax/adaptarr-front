import * as React from 'react'
import { Link } from 'react-router-dom'

import { BookShortInfo } from '../store/types'

type Props = {
  book: BookShortInfo
}

const bookCard = ({ book }: Props) => {
  return (
    <Link to={`books/${book.id}`} className="card">
      <h2 className="card__title">{book.title}</h2>
    </Link>
  )
}

export default bookCard
