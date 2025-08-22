export function getMapValuesAsArray<K, V>(map: Map<K, V>): V[] {
  return Array.from(map.values())
}
