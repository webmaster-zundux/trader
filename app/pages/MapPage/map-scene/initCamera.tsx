import type { Vector3, WebGLRenderer } from 'three'
import { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CAMERA_DEFAULT_POSITION, CAMERA_DEFAULT_TARGET, CAMERA_DISTANCE_MAX, CAMERA_DISTANCE_MIN, MAP_PERSPECTIVE_CAMERA_FOV, MAP_PERSPECTIVE_FRUSTUM_FAR, MAP_PERSPECTIVE_FRUSTUM_NEAR } from '../Map.const'

export function initCamera(
  position: Vector3 = CAMERA_DEFAULT_POSITION,
  target: Vector3 = CAMERA_DEFAULT_TARGET
) {
  const cameraAspect = window.innerWidth / window.innerHeight
  const camera = new PerspectiveCamera(
    MAP_PERSPECTIVE_CAMERA_FOV,
    cameraAspect,
    MAP_PERSPECTIVE_FRUSTUM_NEAR,
    MAP_PERSPECTIVE_FRUSTUM_FAR
  )

  camera.position.copy(position)
  camera.lookAt(target)

  return camera
}

export function initCameraControls(
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  minDistance = CAMERA_DISTANCE_MIN,
  maxDistance = CAMERA_DISTANCE_MAX
) {
  const controls = new OrbitControls(camera, renderer.domElement)

  controls.minDistance = minDistance
  controls.maxDistance = maxDistance

  return controls
}
