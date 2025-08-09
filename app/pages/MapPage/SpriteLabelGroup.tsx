import { memo } from 'react'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { SpriteLabel } from './SpriteLabel'

interface SpriteLabelGroupProps {
  items: (Location | MovingEntity | PlanetarySystem)[]
}
export const SpriteLabelGroup = memo(function SpriteLabelGroup({ items }: SpriteLabelGroupProps) {
  return (
    <>
      {items.map(item => (
        <SpriteLabel key={item.uuid} item={item} />
      ))}
    </>
  )
})
