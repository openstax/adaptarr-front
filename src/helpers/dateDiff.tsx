const dateDiff = (dateString: string) => {
  const from = new Date(dateString)
  from.setTime(from.getTime() - from.getTimezoneOffset() * 60 * 1000)
  const now = new Date()
  const timeDiff = Math.abs(now.getTime() - from.getTime())
  const diffMinutes = Math.ceil(timeDiff / (1000 * 60 * 1))
  const diffHours = Math.ceil(timeDiff / (1000 * 3600 * 1))
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`
  } else if (diffDays >= 1 ) {
    return `${diffDays} days ago`
  }

  return from.toISOString().split('.')[0].replace('T', ' ')
}

export default dateDiff
