import { useCallback, type RefObject } from 'react'
import type { Group, Object3DEventMap, PerspectiveCamera } from 'three'
import { Vector3 } from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CAMERA_DEFAULT_POSITION, CAMERA_DEFAULT_POSITION_FOR_PLANETARY_SYSTEM, CAMERA_DEFAULT_TARGET, MAP_MODE_PLANETARY_SYSTEM, MAP_MODE_UNIVERSE, type MapMode } from '../Map.const'
import { calculateBoundingBoxByPositions } from '../map-scene/calculateBoundingBoxByPositions'

const BOUNDING_BOX_MAX_COORINATE_MULTIPLIER_FOR_MAP_UNIVERSE_MODE = 1.5
const BOUNDING_BOX_MAX_COORINATE_MULTIPLIER_FOR_MAP_PLANETARY_MODE = 2

function adjustCameraPositionToSeeAllSpritesInGroup({
  group,
  camera,
  cameraPos,
  cameraTarget,
  defaultCameraPos,
  defaultCameraTarget,
  cameraControls,
  maxCoordinateMultiplier,
}: {
  group: Group
  camera: PerspectiveCamera
  cameraPos?: Vector3
  cameraTarget?: Vector3
  defaultCameraPos?: Vector3
  defaultCameraTarget?: Vector3
  cameraControls: OrbitControls
  maxCoordinateMultiplier: number
}) {
  if (defaultCameraPos || defaultCameraTarget) {
    if (defaultCameraPos) {
      camera.position.copy(defaultCameraPos)
    }
    if (defaultCameraTarget) {
      camera.lookAt(defaultCameraTarget)
    }
  }

  const boundingBox = calculateBoundingBoxByPositions(group)
  const maxCoordinate = Math.max.apply(undefined, new Array<number>().concat(boundingBox.min.toArray(), boundingBox.max.toArray()).map(Math.abs))
  const boxOrigin = cameraTarget || new Vector3()
  const boxMaxSize = maxCoordinate * maxCoordinateMultiplier

  const fitHeightDistance = boxMaxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
  const fitWidthDistance = fitHeightDistance / camera.aspect
  const distance = Math.max(fitHeightDistance, fitWidthDistance)

  const currentCameraPos = cameraPos || new Vector3().copy(camera.position)
  const direction = boxOrigin.clone().sub(currentCameraPos).normalize().multiplyScalar(distance)

  const newCameraPos = new Vector3().copy(boxOrigin).sub(direction)
  const newCameraTarget = new Vector3().copy(boxOrigin)

  camera.position.copy(newCameraPos)
  camera.lookAt(newCameraTarget)
  cameraControls.update()
}

export function useResetCamera({
  spritesGroupRef,
  cameraControlsRef,
  cameraRef,
}: {
  spritesGroupRef: RefObject<Group<Object3DEventMap> | null>
  cameraControlsRef: RefObject<OrbitControls | null>
  cameraRef: RefObject<PerspectiveCamera | null>
}) {
  const resetCamera = useCallback(function resetCamera(mode: MapMode, isNoVisibleItems: boolean) {
    const camera = cameraRef.current

    if (!camera) {
      return
    }

    const cameraControls = cameraControlsRef.current

    if (!cameraControls) {
      return
    }

    const spritesGroup = spritesGroupRef.current

    if (!spritesGroup) {
      return
    }

    cameraControls.reset()

    if (isNoVisibleItems) {
      return
    }

    if (mode === MAP_MODE_UNIVERSE) {
      adjustCameraPositionToSeeAllSpritesInGroup({
        group: spritesGroup,
        camera,
        cameraControls,
        defaultCameraPos: CAMERA_DEFAULT_POSITION,
        defaultCameraTarget: CAMERA_DEFAULT_TARGET,
        maxCoordinateMultiplier: BOUNDING_BOX_MAX_COORINATE_MULTIPLIER_FOR_MAP_UNIVERSE_MODE,
      })
    } else if (mode === MAP_MODE_PLANETARY_SYSTEM) {
      adjustCameraPositionToSeeAllSpritesInGroup({
        group: spritesGroup,
        camera,
        cameraControls,
        cameraTarget: CAMERA_DEFAULT_TARGET,
        defaultCameraPos: CAMERA_DEFAULT_POSITION_FOR_PLANETARY_SYSTEM,
        defaultCameraTarget: CAMERA_DEFAULT_TARGET,
        maxCoordinateMultiplier: BOUNDING_BOX_MAX_COORINATE_MULTIPLIER_FOR_MAP_PLANETARY_MODE,
      })
    }
  }, [cameraRef, cameraControlsRef, spritesGroupRef])

  return resetCamera
}
