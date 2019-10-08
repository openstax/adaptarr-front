import * as React from 'react'
import { Localized } from 'fluent-react/compat'

const oposite = (n: number): number => {
  if (typeof n !== 'number') {
    throw new Error('oposite(n) accepts only numbers.')
  }
  return -n
}

const DateDiff = ({ dateString }: { dateString: string }) => {
  const from = new Date(dateString)
  from.setTime(from.getTime() + oposite(from.getTimezoneOffset() * 60 * 1000))
  const now = new Date()
  const timeDiff = Math.abs(now.getTime() - from.getTime())
  const diffMinutes = Math.ceil(timeDiff / (1000 * 60 * 1))
  const diffHours = Math.ceil(timeDiff / (1000 * 3600 * 1))
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (diffMinutes === 1) {
    return <Localized id="date-diff-now">just now</Localized>
  } else if (diffMinutes < 60) {
    return <Localized id="date-diff-minutes" $minutes={diffMinutes}>
      {`{ $minutes } minutes ago`}
    </Localized>
  } else if (diffHours < 24) {
    return <Localized id="date-diff-hours" $hours={diffHours}>
      {`{ $hours } hours ago`}
    </Localized>
  } else if (diffDays >= 1) {
    return <Localized id="date-diff-days" $days={diffDays}>
      {`{ $days } days ago`}
    </Localized>
  }

  return <span>{from.toTimeString().split('.')[0].replace('T', ' ')}</span>
}

export default DateDiff
