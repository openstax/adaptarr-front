const decodeHtmlEntity = function(str: string) {
  return str.replace(/&#(\d+);/g, function(_, dec) {
    return String.fromCharCode(dec)
  })
}

export default decodeHtmlEntity
