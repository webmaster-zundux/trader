import { randomUUID } from '~/stores/utils/createRandomUUID'
import type { StorageDataJsonOject } from './import-export-storage-data'

function isPropertyNameForUUIDValue(propertyName: string) {
  return /^.*uuid$/i.test(propertyName)
}

const UUIDMap = new Map<string, number>()

function getReplacementId(uuid: string): number {
  let integerId = UUIDMap.get(uuid)

  if (!integerId) {
    integerId = UUIDMap.size + 1
    UUIDMap.set(uuid, integerId)
  }

  return integerId
}

function replaceUUIDByIncrementalIntegerAsJSONReplacer(key: string, value: unknown): unknown | never {
  if (isPropertyNameForUUIDValue(key)) {
    if (typeof value !== 'string') {
      const errorMessage = `Replacing uuid by integer failed. Entity property with name ".*uuid" has value type different from "string"`

      console.error(errorMessage)
      throw new Error(errorMessage)
      return value
    }

    return getReplacementId(value)
  }

  return value
}

export function replaceUuidByIntegerInStorageDataJsonOject(
  state: StorageDataJsonOject
): StorageDataJsonOject {
  try {
    const result: StorageDataJsonOject = {}

    for (const propertyName in state) {
      if (!Object.prototype.hasOwnProperty.call(state, propertyName)) {
        continue
      }

      const serializedValue = JSON.parse(state[propertyName])

      result[propertyName] = JSON.stringify(serializedValue, replaceUUIDByIncrementalIntegerAsJSONReplacer) // todo - add support for additional types in superjson (for those that are not supported in JSON)
    }

    return result
  } finally {
    UUIDMap.clear()
  }
}

const integerIdMap = new Map<number, string>()

function getReplacementUUID(integerId: number): string {
  let uuid = integerIdMap.get(integerId)

  if (!uuid) {
    uuid = randomUUID()
    integerIdMap.set(integerId, uuid)
  }

  return uuid
}

function replaceIncrementalIntegerByUUIDAsJsonReviver(key: string, value: unknown): unknown | never {
  if (isPropertyNameForUUIDValue(key)) {
    if (typeof value !== 'number') {
      const errorMessage = `Dump file deserialization error. Replacing integer by uuid failed. Entity property with name "uuid" has value type different from "number".`

      console.error(errorMessage)
      throw new Error(errorMessage)
    }

    return getReplacementUUID(value)
  }

  return value
}

export function replaceIntegerByUuidInStorageDataJsonOject(
  state: StorageDataJsonOject
): StorageDataJsonOject {
  try {
    const result: StorageDataJsonOject = {}

    for (const propertyName in state) {
      const deserializedValue = JSON.parse(state[propertyName] as string, replaceIncrementalIntegerByUUIDAsJsonReviver) // todo - add support for additional types in superjson (for those that are not supported in JSON)

      result[propertyName] = JSON.stringify(deserializedValue)
    }

    return result
  } finally {
    integerIdMap.clear()
  }
}
