const MONTHS = [
  'იანვარი',
  'თებერვალი',
  'მარტი',
  'აპრილი',
  'მაისი',
  'ივნისი',
  'ივლისი',
  'აგვისტო',
  'სექტემბერი',
  'ოქტომბერი',
  'ნოემბერი',
  'დეკემბერი',
] as const

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

interface DateParts {
  year: number
  month: number // 1-12
  day: number
}

/** YYYY-MM-DD სტრიქონის დაშლა Date ობიექტის (და დროის სარტყლის) გარეშე. */
function parseIsoDate(value: string): DateParts | null {
  const match = ISO_DATE.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1) return null
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  if (day > daysInMonth) return null
  return { year, month, day }
}

export function isValidIsoDate(value: string): boolean {
  return parseIsoDate(value) !== null
}

/** "2026-10-28" → "28 ოქტომბერი, 2026". არასწორი ფორმატისას ბრუნდება საწყისი სტრიქონი. */
export function formatLongDate(value: string): string {
  const parts = parseIsoDate(value)
  if (!parts) return value
  return `${parts.day} ${MONTHS[parts.month - 1]}, ${parts.year}`
}

/** "2026-11-06" → "6 ნოემბერი". */
export function formatDayMonth(value: string): string {
  const parts = parseIsoDate(value)
  if (!parts) return value
  return `${parts.day} ${MONTHS[parts.month - 1]}`
}

/** დღევანდელი თარიღი ადგილობრივ დროში, YYYY-MM-DD სტრიქონად (state-ში Date არ ინახება). */
export function todayIso(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}
