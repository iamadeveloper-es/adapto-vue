export const remToPx = (rem: string): number => {
  const remUnit = parseFloat(rem)
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  )

  return remUnit * rootFontSize
}
