// eslint-disable-next-line arrow-body-style
const decodeHtmlEntity = (str: string) => {
  return str.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
}

export default decodeHtmlEntity
