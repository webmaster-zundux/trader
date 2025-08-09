export function getAttributesByWhiteList<O extends object, S extends O = O>(
  source: S,
  attributesWhiteList: (keyof O)[]
): O {
  const sourceProperties = {} as O

  attributesWhiteList.forEach((attributeName) => {
    sourceProperties[attributeName] = source[attributeName]
  })

  return sourceProperties
}
