// Arguments for l20n have to start with $ sign.
const validateL20nArgs = (args: { [key: string]: any }) => {
  let validated = {}
  Object.entries(args).forEach(([key, val]) => {
    if (key[0] === '$') {
      validated[key] = val
    } else {
      validated['$' + key] = val
    }
  })
  return validated
}

export default validateL20nArgs
