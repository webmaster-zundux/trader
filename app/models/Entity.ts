export type Entity = {
  uuid: string
  entityType: string | undefined
}

export function isUuid(uuid: unknown): uuid is Entity['uuid'] {
  return typeof uuid === 'string'
}
