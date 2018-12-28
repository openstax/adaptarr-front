import * as React from 'react'

import Avatar from 'src/components/ui/Avatar'
import MessageInput from 'src/components/MessageInput';

type Props = {

}

class Conversation extends React.Component<Props> {

  state: {

  } = {

  }

  public render() {
    return (
      <div className="conv">
        <div className="conv__messages">
          <div className="conv__message conv__message--me">
            <div className="conv__content">
              <div className="conv__date">
                16:01
              </div>
              <div className="conv__text">
                Error corrupti dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis.
              </div>
            </div>
          </div>
          <div className="conv__message conv__message--other">
            <div className="conv__content">
              <div className="conv__avatar">
                <Avatar size="small" user={undefined}/>
              </div>
              <div className="conv__text">
                Error corrupti dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis.
              </div>
              <div className="conv__date">
                16:09
              </div>
            </div>
          </div> 
          <div className="conv__message conv__message--me">
            <div className="conv__content">
              <div className="conv__date">
                16:10
              </div>
              <div className="conv__text">
                Error corrupti dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis.
              </div>
            </div>
          </div>
          <div className="conv__message conv__message--other">
            <div className="conv__content">
              <div className="conv__avatar">
                <Avatar size="small" user={undefined}/>
              </div>
              <div className="conv__text">
                Error corrupti dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis.
              </div>
              <div className="conv__date">
                16:13
              </div>
            </div>
          </div>
          <div className="conv__message conv__message--other">
            <div className="conv__content">
              <div className="conv__avatar">
                <Avatar size="small" user={undefined}/>
              </div>
              <div className="conv__text">
                Error corrupti dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis.
              </div>
              <div className="conv__date">
                16:14
              </div>
            </div>
          </div>
          <div className="conv__message conv__message--me">
            <div className="conv__content">
              <div className="conv__date">
                17:32
              </div>
              <div className="conv__text">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error corrupti dolor ea nam perspiciatis veniam animi non nobis culpa, dignissimos, veritatis facilis fugiat nemo asperiores odit voluptatibus ratione neque minima.
              </div>
            </div>
          </div>
        </div>
        <div className="conv__input">
          <MessageInput/>
        </div>
      </div>
    )
  }
}

export default Conversation
