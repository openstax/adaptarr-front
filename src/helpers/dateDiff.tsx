const oposite = (n: number): number => {
  if (typeof n !== 'number') {
    throw new Error('oposite(n) accepts only numbers.')
  }
  return -n
}

const dateDiff = (dateString: string) => {
  let from = new Date(dateString)
  from.setTime(from.getTime() + oposite(from.getTimezoneOffset() * 60 * 1000))
  let now = new Date()
  now.setTime(now.getTime() + oposite(now.getTimezoneOffset() * 60 * 1000))
  const timeDiff = Math.abs(now.getTime() - from.getTime())
  const diffMinutes = Math.ceil(timeDiff / (1000 * 60 * 1))
  const diffHours = Math.ceil(timeDiff / (1000 * 3600 * 1))
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (diffMinutes === 1) {
    return 'just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays >= 1 ) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }

  return from.toISOString().split('.')[0].replace('T', ' ')
}

export default dateDiff
