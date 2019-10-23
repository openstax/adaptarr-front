import * as React from 'react'

const TicketOpenDate = ({ date }: { date: Date }) => (
  <span className="tickets__date">
    {
      new Intl.DateTimeFormat(
        'default', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(date)
    }
  </span>
)

export default TicketOpenDate
