import { memo, useMemo } from 'react'
import { isLocation, type Location } from '~/models/entities/Location'
import { isMovingEntity, type MovingEntity } from '~/models/entities/MovingEntity'
import { isPlanetarySystem, type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { parsePositionFromString } from '~/models/Position'
import { cn } from '~/utils/ui/ClassNames'
import styles from './SpriteLabel.module.css'

interface SpriteLabelProps {
  item: Location | MovingEntity | PlanetarySystem
}
export const SpriteLabel = memo(function SpriteLabel({
  item,
}: SpriteLabelProps) {
  const spriteLabelAnchorClassNames = useMemo(function spriteLabelAnchorClassNamesMemo() {
    let additionalCssClassNames: string[] = []

    if (isLocation(item)) {
      additionalCssClassNames = [styles.LocationLabel]
    } else if (isMovingEntity(item)) {
      additionalCssClassNames = [styles.MovingEntityLabel]
    } else if (isPlanetarySystem(item)) {
      additionalCssClassNames = [styles.PlanetarySystemLabel]
    }

    return cn([styles.SpriteLabelAnchor].concat(additionalCssClassNames))
  }, [item])

  if (!item) {
    return undefined
  }

  const position = parsePositionFromString(item.position)

  if (!position) {
    return undefined
  }

  let itemId: string | undefined = undefined
  const itemName = item.name || 'unknown name'

  if (isLocation(item)) {
    itemId = item.id
  } else if (isMovingEntity(item)) {
    itemId = item.id
  } else if (isPlanetarySystem(item)) {
    // noop
  }

  return (
    <div
      data-item-uuid={item.uuid}
      className={spriteLabelAnchorClassNames}
    >
      <div className={styles.SpriteLabel}>
        {itemId && (
          <div className={styles.GroupItemId}>
            {itemId}
          </div>
        )}
        <div className={styles.GroupItemName}>
          {itemName}
        </div>
      </div>
    </div>
  )
})
