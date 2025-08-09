// additional utility types
// or can be used types from https://github.com/piotrwitek/utility-types

import type { Entity } from '../Entity'

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredChoosenAndOtherOptional<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>

export type Promisefy<T> = Promise<T> | T

export type WithoutUUID<T extends Entity> = Omit<T, 'uuid'>
export type WithUUID<T extends Entity> = T & Required<Pick<T, 'uuid'>>
export type PartialWithUUID<T extends Entity> = Partial<T> & Required<Pick<T, 'uuid'>>
