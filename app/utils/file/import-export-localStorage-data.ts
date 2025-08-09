export function clearLocalStorage() {
  try {
    window.localStorage.clear()
  } catch (error) {
    console.error(error)
    return `Error. Impossible to clear localStorage`
  }

  return undefined
}

export const setLocalStorageState = (
  stateToRestore: { [key: string]: string }
): unknown | undefined => {
  try {
    for (const key in stateToRestore) {
      window.localStorage.setItem(key, stateToRestore[key])
    }
  } catch (error) {
    console.warn(error)
    return error
  }

  return undefined
}
