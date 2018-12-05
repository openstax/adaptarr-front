import * as React from 'react'
import { AxiosResponse } from 'axios'

import axios from '../../../config/axios'

import Section from '../../../components/Section'
import Header from '../../../components/Header'

import * as types from '../../../store/types'

type Props = {
  match: {
    params: {
      id: string
    }
  }
}

class Book extends React.Component<Props> {
  state: {
    isLoading: boolean,
    book: types.Book
  } = {
    isLoading: true,
    book: {
      id: 'loading',
      title: 'Loading...',
      parts: [],
    },
  }

  private fetchBook = (id: string) => {
    axios.get(`books/${id}`)
      .then((res: AxiosResponse) => {
        this.setState({
          isLoading: false,
          book: res.data,
        })
      })
      .catch((e: ErrorEvent) => {
        console.log(e.message)
        this.setState({isLoading: false})
      })
  }

  componentDidMount () {
    this.fetchBook(this.props.match.params.id)
  }
  
  public render() {
    const { book } = this.state

    return (
      <Section>
        <Header title={book.title} />
        <div className="section__content">
          {JSON.stringify(book.parts)}
        </div>
      </Section>
    )
  }
}

export default Book
