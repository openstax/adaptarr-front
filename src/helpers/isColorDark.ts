/**
 * Check if provided color (in HEX) is dark.
 * @param color - color in HEX
 */
const isColorDark = (color: string): boolean => {
  const c = color.substring(1)
  const rgb = parseInt(c, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff

  const luma = (r + g + b) / 3

  if (luma < 128) {
    return true
  }

  return false
}

export default isColorDark
