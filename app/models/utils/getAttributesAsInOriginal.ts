export function getAttributesAsInOriginal<O extends object, S extends O = O>(
  source: S,
  original: O
): O {
  const originalAttributesNames = Object.keys(original) as (keyof O)[]
  const sourceProperties = {} as O

  originalAttributesNames.forEach((attributeName) => {
    sourceProperties[attributeName] = source[attributeName]
  })

  return sourceProperties
}
