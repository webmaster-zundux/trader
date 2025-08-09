export function isObjectsHaveAtLeastOneDifferentAttribute<T>(a?: T, b?: T): boolean {
  if (!a && !b) {
    return false
  }

  if (!a || !b) {
    return true
  }

  for (const keyA in a) {
    if (a[keyA] !== b[keyA]) {
      return true
    }
  }

  for (const keyB in b) {
    if (a[keyB] !== b[keyB]) {
      return true
    }
  }

  return false
}
