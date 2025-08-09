export function getMapKeysAsArray<K, V>(map: Map<K, V>) {
  return Array.from(map.keys())
}
