import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import './index.css'

const TicketOpenDate = ({ date }: { date: Date }) => (
  <span className="tickets__date">
    <span>
      <Localized
        id="date-weekday-monthday-month"
        $date={date}
      >
        {`{ $weekday }, { $monthday } { $month }`}
      </Localized>
    </span>
    <span>
      <Localized id="date-hour-min" $date={date}>
        {`{ $hour }:{ $min }`}
      </Localized>
    </span>
  </span>
)

export default TicketOpenDate
