import { isAfter, isBefore, isSameDay, subDays } from 'date-fns'

export function humanReadableDate(comparisonDate: Date) {
  const today = new Date()
  const yesterday = subDays(today, 1)
  const threeDaysAgo = subDays(today, 2)
  const fourDaysAgo = subDays(today, 3)
  const fiveDaysAgo = subDays(today, 4)
  const sixDaysAgo = subDays(today, 5)
  const aWeekAgo = subDays(today, 6)
  const twoWeeksAgo = subDays(today, 13)
  const aMonthAgo = subDays(today, 29)
  const twoMonthsAgo = subDays(today, 59)

  let result
  if (isSameDay(comparisonDate, today)) {
    result = 'сегодня'
  } else if (isSameDay(comparisonDate, yesterday)) {
    result = 'вчера'
  } else if (isSameDay(comparisonDate, threeDaysAgo)) {
    result = 'позавчера'
  } else if (isSameDay(comparisonDate, fourDaysAgo)) {
    result = '4 дня назад'
  } else if (isSameDay(comparisonDate, fiveDaysAgo)) {
    result = '5 дней назад'
  } else if (isSameDay(comparisonDate, sixDaysAgo)) {
    result = '6 дней назад'
  } else if (isSameDay(comparisonDate, aWeekAgo)) {
    result = 'неделю назад'
  } else if (isAfter(comparisonDate, twoWeeksAgo)) {
    result = 'более недели назад'
  } else if (isSameDay(comparisonDate, twoWeeksAgo)) {
    result = '2 недели назад'
  } else if (isAfter(comparisonDate, aMonthAgo)) {
    result = 'меньше месяца назад'
  } else if (isSameDay(comparisonDate, aMonthAgo) || isAfter(comparisonDate, twoMonthsAgo)) {
    result = 'месяц назад'
  } else {
    result = comparisonDate.toLocaleString('ru', {
      ...(comparisonDate.getFullYear() !== today.getFullYear() && { year: 'numeric' }),
      month: 'long',
      day: 'numeric',
    })
  }

  return result
}
