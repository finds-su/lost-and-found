import { isAfter, isSameDay, subDays } from 'date-fns'

export function humanReadableDate(comparisonDate: Date) {
  const today = new Date()
  const yesterday = subDays(today, 1)
  const aWeekAgo = subDays(today, 7)
  const twoWeeksAgo = subDays(today, 14)
  const threeWeeksAgo = subDays(today, 21)

  // Get the date in English locale to match English day of week keys
  const compare = comparisonDate

  let result = comparisonDate.toLocaleString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  if (isSameDay(compare, today)) {
    result = 'сегодня'
  } else if (isSameDay(compare, yesterday)) {
    result = 'вчера'
  } else if (isAfter(compare, aWeekAgo)) {
    result = 'неделю назад'
  } else if (isAfter(compare, twoWeeksAgo)) {
    result = '2 недели назад'
  } else if (isAfter(compare, threeWeeksAgo)) {
    result = '3 недели назад'
  }

  return result
}
