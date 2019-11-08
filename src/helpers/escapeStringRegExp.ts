export const MATCH_OPERATORS = /[|\\{}()[\]^$+*?.]/g

const escapeStringRegExp = (str: string) => str.replace(MATCH_OPERATORS, '\\$&')

export default escapeStringRegExp
