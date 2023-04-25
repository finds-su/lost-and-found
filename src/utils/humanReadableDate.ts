import { isAfter, isSameDay, subDays } from 'date-fns'

export function humanReadableDate(comparisonDate: Date) {
  const today = new Date()
  const yesterday = subDays(today, 1)
  const aWeekAgo = subDays(today, 7)
  const twoWeeksAgo = subDays(today, 14)
  const threeWeeksAgo = subDays(today, 21)

  let result
  if (isSameDay(comparisonDate, today)) {
    result = 'сегодня'
  } else if (isSameDay(comparisonDate, yesterday)) {
    result = 'вчера'
  } else if (isAfter(comparisonDate, aWeekAgo)) {
    result = 'неделю назад'
  } else if (isAfter(comparisonDate, twoWeeksAgo)) {
    result = '2 недели назад'
  } else if (isAfter(comparisonDate, threeWeeksAgo)) {
    result = '3 недели назад'
  } else {
    result = comparisonDate.toLocaleString('ru', {
      ...(comparisonDate.getFullYear() !== today.getFullYear() && { year: 'numeric' }),
      month: 'long',
      day: 'numeric',
    })
  }

  return result
}
