import type { Sprite } from 'three'

export function isSprite(value: unknown): value is Sprite {
  return ((value as Sprite)?.isSprite)
}
