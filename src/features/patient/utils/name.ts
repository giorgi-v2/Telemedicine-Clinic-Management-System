/** "გიორგი ბერიძე" → "გბ" */
export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join('')
}

/** "გიორგი ბერიძე" → "გიორგი ბ." */
export function getShortName(fullName: string): string {
  const [first, last] = fullName.trim().split(/\s+/)
  if (!first) return ''
  if (!last) return first
  return `${first} ${Array.from(last)[0]}.`
}
