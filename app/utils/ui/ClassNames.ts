export const cn = (classes: (string | boolean | undefined)[]): string => {
  return classes
    .filter(v => Boolean(v))
    .join(' ')
}
