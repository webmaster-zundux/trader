import { memo, useMemo } from 'react'
import { isLocation, type Location } from '~/models/entities/Location'
import { isMovingEntity, type MovingEntity } from '~/models/entities/MovingEntity'
import { isPlanetarySystem, type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { parsePositionFromString } from '~/models/Position'
import { cn } from '~/utils/ui/ClassNames'
import styles from './SpriteHighlight.module.css'

interface SpriteHighlightProps {
  item: Location | MovingEntity | PlanetarySystem
}
export const SpriteHighlight = memo(function SpriteHighlight({
  item,
}: SpriteHighlightProps) {
  const spriteHighlightAnchorClassNames = useMemo(function spriteHighlightAnchorClassNamesMemo() {
    let additionalCssClassNames: string[] = []

    if (isLocation(item)) {
      additionalCssClassNames = [styles.LocationHighlight]
    } else if (isMovingEntity(item)) {
      additionalCssClassNames = [styles.MovingEntityHighlight]
    } else if (isPlanetarySystem(item)) {
      additionalCssClassNames = [styles.PlanetarySystemHighlight]
    }

    return cn([styles.SpriteHighlightAnchor].concat(additionalCssClassNames))
  }, [item])

  if (!item) {
    return undefined
  }

  const position = parsePositionFromString(item.position)

  if (!position) {
    return undefined
  }

  // let itemId: string | undefined = undefined
  // const itemName = item.name || 'unknown name'

  // if (isLocation(item)) {
  //   itemId = item.id
  // } else if (isMovingEntity(item)) {
  //   itemId = item.id
  // } else if (isPlanetarySystem(item)) {
  //   // noop
  // }

  return (
    <div
      data-item-uuid={item.uuid}
      className={spriteHighlightAnchorClassNames}
    >
      {/* <div className={styles.SpriteHighlight}>
        {itemId && (
          <div className={styles.GroupItemId}>
            {itemId}
          </div>
        )}
        <div className={styles.GroupItemName}>
          {itemName}
        </div>
      </div> */}
    </div>
  )
})
