import type { Object3D, Quaternion } from 'three'
import { Group, Vector3 } from 'three'
import type { PreferedColorTheme } from '~/components/PreferedColorThemeSwitch.const'
import { QUATERNION_TO_ROTATE_BY_X_AXIS_NEGATIVE_90 } from '../Map.const'
import { createLine } from './createLine'

export function createTwoCrossedLines({
  position,
  parentQuaternion,
  group,
  size = 1,
  colorTheme,
}: {
  position: Vector3
  parentQuaternion: Quaternion
  group: Object3D | Group
  size?: number
  colorTheme: PreferedColorTheme
}) {
  const cross = new Group()

  const lineOnePoints = [new Vector3(-0.5, 0, -0.5), new Vector3(+0.5, 0, +0.5)]
  const lineTwoPoints = [new Vector3(+0.5, 0, -0.5), new Vector3(-0.5, 0, +0.5)]
  const lineOne = createLine(lineOnePoints, colorTheme)
  const lineTwo = createLine(lineTwoPoints, colorTheme)

  cross.add(lineOne)
  cross.add(lineTwo)

  cross.position.copy(position)
  cross.applyQuaternion(parentQuaternion)

  cross.applyQuaternion(QUATERNION_TO_ROTATE_BY_X_AXIS_NEGATIVE_90)

  cross.scale.copy(new Vector3(size, size, size))

  cross.addEventListener('removed', function onRemoved() {
    cross.clear()
  })

  group.add(cross)

  return cross
}
