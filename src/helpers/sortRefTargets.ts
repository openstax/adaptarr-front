import { ReferenceTarget } from 'src/store/types'

const sortRefTargets = (a: ReferenceTarget, b: ReferenceTarget) => {
  if (a.counter > b.counter) {
    return 1
  } else if (a.counter < b.counter) {
    return -1
  }
  return 0
}

export default sortRefTargets
