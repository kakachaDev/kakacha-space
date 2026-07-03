const MONTHS_RU = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

export function formatDateRu(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return isoDate
  const [, year, month, day] = match
  const monthName = MONTHS_RU[Number(month) - 1]
  if (!monthName) return isoDate
  return `${Number(day)} ${monthName} ${year}`
}
