const isValidUrl = (url: string) => {
  if (/^www\./.test(url)) {
    url = 'http://' + url
  }

  try {
    const _ = new URL(url)
    return true
  } catch {
    return false
  }
}

export default isValidUrl
