import * as React from 'react'

import Header from '../../../components/Header'

type Props = {
  match: {
    params: {
      id: string
    }
  }
}

const book = (props: Props) => {
  const bookTitle = 'Loading...'
  
  return (
    <section className="section--wrapper">
      <Header title={bookTitle} />
      <div className="section__content">
        Book
      </div>
    </section>
  )
}

export default book
