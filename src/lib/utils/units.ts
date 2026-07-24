export const remToPx = (rem: string): number => {
  if (typeof document === 'undefined') return 0

  const remUnit = parseFloat(rem)
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  )

  return remUnit * rootFontSize
}
