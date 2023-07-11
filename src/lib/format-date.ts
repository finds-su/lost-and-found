const months: { [name: number]: string } = {
  1: 'янв.',
  2: 'фев.',
  3: 'марта',
  4: 'апр.',
  5: 'мая',
  6: 'июня',
  7: 'июля',
  8: 'авг.',
  9: 'сент.',
  10: 'окт.',
  11: 'нояб.',
  12: 'дек.',
}

export function formatDate(rawDate: string) {
  const date = new Date(rawDate)
  const day = date.getDate()
  const month = months[date.getMonth() + 1]
  const year = date.getFullYear()

  const nowYear = new Date().getFullYear()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()
  return `${day} ${month ?? ''} ${year === nowYear ? '' : year}`
}
