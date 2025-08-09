export function getFilterValueOnlyWithExistingAttributes(filterValue: object) {
  for (const key in filterValue) {
    const keyName = key as keyof typeof filterValue

    if (!filterValue[keyName]) {
      delete filterValue[keyName]
    }
  }

  const existingParamValueAttributes = Object.values(filterValue).filter(value => !!value)

  if (!existingParamValueAttributes.length) {
    return undefined
  }

  return filterValue
}
