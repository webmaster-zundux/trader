export function getMapValuesAsArray<K, V>(map: Map<K, V>) {
  return Array.from(map.values())
}
