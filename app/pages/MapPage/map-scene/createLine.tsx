import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from 'three'
import type { PreferedColorTheme } from '~/components/PreferedColorThemeSwitch'
import { SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_CROSS_COLOR_DARK_THEME, SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_CROSS_COLOR_LIGHT_THEME } from '../Map.const'

export function createLine(
  points = [new Vector3(), new Vector3(1, 1, 1)],
  colorTheme: PreferedColorTheme
) {
  const lineGeometry = new BufferGeometry().setFromPoints(points)
  const materialColor = colorTheme === 'light'
    ? SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_CROSS_COLOR_LIGHT_THEME
    : SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_CROSS_COLOR_DARK_THEME
  const lineMaterial = new LineBasicMaterial({ color: materialColor, toneMapped: false })

  const line = new Line(lineGeometry, lineMaterial)

  line.addEventListener('removed', function onRemoved() {
    line.material.dispose()
    line.geometry.dispose()
  })

  return line
}
