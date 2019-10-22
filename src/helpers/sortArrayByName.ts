type Obj = {
  name: string
}

const sortArrayByName = (a: Obj, b: Obj): number => {
  if (a.name > b.name) {
    return -1
  } else if (a.name < b.name) {
    return 1
  }
  return 0
}

export default sortArrayByName
