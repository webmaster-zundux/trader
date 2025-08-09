import { Quaternion, Vector3 } from 'three'

export const MAP_TEXTURE_NAMES = {
  circle: `circle`,
  structureUnknown: 'structure-unknown',
  shipUnknown: 'ship-unknown',
} as const

export const SPRITE_SIZES_FOR_LOCATION_BY_TYPE: { [key: string]: number } = {
  'asteroid': 0.1,
  'space travel gate': 0.6,
}

export const CANVAS_BACKGROUND_COLOR_DARK_THEME = '#333'
export const CANVAS_BACKGROUND_COLOR_LIGHT_THEME = '#ccc'

export const SPRITE_COLOR_DARK_THEME = 'whitesmoke'
export const SPRITE_COLOR_LIGHT_THEME = '#222'
export const SPRITE_COLOR_HOVERED_COLOR_DARK_THEME = '#f66'
export const SPRITE_COLOR_HOVERED_COLOR_LIGHT_THEME = '#d60000'
export const SPRITE_COLOR_SELECTED_COLOR_DARK_THEME = '#6f6'
export const SPRITE_COLOR_SELECTED_COLOR_LIGHT_THEME = '#090'
export const SPRITE_COLOR_SELECTED_AND_HOVERED = '#fc6'

export const SCENE_PLANE_HELPER_PADDING_IN_SCENE_COORDINATE_SYSTEM = 0.2
export const SCENE_PLANE_NORMAL = new Vector3(0, 1, 0)
export const SCENE_PLANE_HELPER_COLOR_DARK_THEME = 'black'
export const SCENE_PLANE_HELPER_COLOR_LIGHT_THEME = 'white'
export const SCENE_PLANE_HELPER_OPACITY = 0.4

export const SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_COLOR_DARK_THEME = '#666'
export const SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_COLOR_LIGHT_THEME = '#999'

export const SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_CROSS_COLOR_DARK_THEME = '#666'
export const SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_CROSS_COLOR_LIGHT_THEME = '#999'
export const SCENE_PLANE_HELPER_POINT_PROJECTION_LINE_CROSS_SIZE_AT_POINT_ON_PLANE = 0.05 // in threejs scene units

export const QUATERNION_TO_ROTATE_BY_X_AXIS_NEGATIVE_90 = new Quaternion()
QUATERNION_TO_ROTATE_BY_X_AXIS_NEGATIVE_90.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2)

export const QUATERNION_TO_ROTATE_BY_X_AXIS_POSITION_90 = new Quaternion()
QUATERNION_TO_ROTATE_BY_X_AXIS_POSITION_90.setFromAxisAngle(new Vector3(1, 0, 0), +Math.PI / 2)

export const MAP_MODE_UNIVERSE = 'universe' as const
export const MAP_MODE_PLANETARY_SYSTEM = 'planetary-system' as const
export type MapMode = (typeof AVAILABLE_MAP_MODES)[number]
const AVAILABLE_MAP_MODES = [
  MAP_MODE_UNIVERSE,
  MAP_MODE_PLANETARY_SYSTEM,
] as const

export function isMapMode(value: unknown): value is MapMode {
  return (typeof value === 'string')
    ? AVAILABLE_MAP_MODES.includes(value as MapMode)
    : false
}

export const MAP_PERSPECTIVE_CAMERA_FOV = 85
export const MAP_PERSPECTIVE_FRUSTUM_NEAR = 0.001
export const MAP_PERSPECTIVE_FRUSTUM_FAR = 1000

export const CAMERA_DISTANCE_MIN = 1
export const CAMERA_DISTANCE_MAX = 100

export const CAMERA_DEFAULT_POSITION = new Vector3(0, 0, 10)
export const CAMERA_DEFAULT_POSITION_FOR_PLANETARY_SYSTEM = new Vector3(0, 3, 10)
export const CAMERA_DEFAULT_TARGET = new Vector3(0, 0, 0)

export const FORCED_MAP_RENDER_FRAME_DELAY_IN_MS = 100
