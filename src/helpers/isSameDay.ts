const isSameDay = (date1: Date, date2: Date) => {
  if (
    date1.getDay() === date2.getDay()
    && date1.getMonth() === date2.getMonth()
    && date1.getFullYear() === date2.getFullYear()
  ) return true
  return false
}

export default isSameDay
