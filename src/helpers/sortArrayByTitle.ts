type Obj = {
  title: string
}

const sortArrayByTitle = (a: Obj, b: Obj): number => {
  if (a.title > b.title) {
    return 1
  } else if (a.title < b.title) {
    return -1
  }
  return 0
}

export default sortArrayByTitle
