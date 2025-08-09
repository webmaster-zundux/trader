import { AxesHelper, type Scene } from 'three'

export function initAxisHelper(
  scene: Scene,
  lineWidth = 1
) {
  const axesHelper = new AxesHelper(lineWidth)

  scene.add(axesHelper)
  return axesHelper
}
