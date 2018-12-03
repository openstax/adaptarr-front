import * as React from 'react'

import Section from '../../../components/Section'
import Header from '../../../components/Header'

type State = {
  showBookInfo: boolean,
  bookInfo: {
    id?: number,
    title?: string,
  }
}

class Books extends React.Component {
  state: State = {
    showBookInfo: false,
    bookInfo: {},
  }
  
  setBookInfo = (id: number): void => {
    const bookInfo = {
      id: id,
      title: 'Psychology',
    }

    this.setState({showBookInfo: true, bookInfo})
  }

  public render() {
    return (
      <div className="container container--splitted">
        <Section>
          <Header title={"Books"} />
          <div className="section__content">
            Books
            <button onClick={() => this.setBookInfo(2)}>Show book info</button>
          </div>
        </Section>
        {
          this.state.showBookInfo ? 
        <Section>
          <Header title={this.state.bookInfo.title} />
          <div className="section__content">
            Book info
          </div>
        </Section>
          : null
        }
      </div>
    )
  }
}

export default Books
