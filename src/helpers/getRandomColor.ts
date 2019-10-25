const letters = '0123456789ABCDEF'

const getRandomColor = (): string => {
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export default getRandomColor
