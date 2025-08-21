import { memo } from 'react'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { SpriteHighlight } from './SpriteHighlight'

interface SpriteHighlightGroupProps {
  items: (Location | MovingEntity | PlanetarySystem)[]
}
export const SpriteHighlightGroup = memo(function SpriteHighlightGroup({ items }: SpriteHighlightGroupProps) {
  return (
    <>
      {items.map(item => (
        <SpriteHighlight key={item.uuid} item={item} />
      ))}
    </>
  )
})
