const regExp = /^#([0-9A-F]{3}){1,2}$/i
const isValidHex = (color: string) => regExp.test(color)

export default isValidHex
