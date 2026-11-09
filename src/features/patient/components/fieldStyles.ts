// ველების კლასები სრულად წერია (Tailwind-ის სკანერისთვის); ერთი ადგილიდან იმპორტდება.
const BASE =
  'block w-full rounded-lg border bg-white px-3.5 py-3 text-[15px] text-ink outline-none transition-colors disabled:bg-surface disabled:text-muted'
const VALID = 'border-line focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25'
const INVALID = 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/25'

export function fieldClasses(hasError: boolean): string {
  return `${BASE} ${hasError ? INVALID : VALID}`
}
