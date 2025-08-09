import { type ReactNode, isValidElement } from 'react'

export function isValidReactNode(value: unknown): value is ReactNode {
  return isValidElement(value) || !(value instanceof Object)
}
