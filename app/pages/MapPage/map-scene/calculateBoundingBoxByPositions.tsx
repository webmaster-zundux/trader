import type { Group } from 'three'
import { Box3, type Object3D } from 'three'

export function calculateBoundingBoxByPositions(group: Group) {
  const boundingBox = new Box3()

  group.traverse(function forEachObject3DInGroup(object: Object3D) {
    boundingBox.expandByPoint(object.position)
  })

  return boundingBox
}
