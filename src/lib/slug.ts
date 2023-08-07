export default function generateSlug(str: string): string {
  str = str.trim().toLowerCase()
  str = str.slice(0, 100)

  const nonCyrillic = str.match(/[а-яё]/i)
  const nonLatin = str.match(/[a-z]/i)

  if (!(nonCyrillic || nonLatin)) {
    return ''
  }

  return str
    .replace(/ /g, '-') // replace spaces with dashes
    .replace(/[^a-zа-яё0-9-]/g, '') // remove all non-cyrillic, non-latin, non-dash characters
}
