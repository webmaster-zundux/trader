import type { Group, PerspectiveCamera, Scene } from 'three'
import { type Sprite, Raycaster, Vector2, WebGLRenderer } from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { COLOR_THEME_DARK, type PreferedColorTheme } from '~/components/PreferedColorThemeSwitch.const'
import type { Location } from '~/models/entities/Location'
import type { MovingEntity } from '~/models/entities/MovingEntity'
import type { PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { SPRITE_COLOR_DARK_THEME, SPRITE_COLOR_HOVERED_COLOR_DARK_THEME, SPRITE_COLOR_HOVERED_COLOR_LIGHT_THEME, SPRITE_COLOR_LIGHT_THEME, SPRITE_COLOR_SELECTED_COLOR_DARK_THEME, SPRITE_COLOR_SELECTED_COLOR_LIGHT_THEME } from '../Map.const'
import { CSS2DRendererForReactComponent } from './CSS2DRendererForReactComponent'
import { initCamera, initCameraControls } from './initCamera'
import { initPlaneHelper } from './initPlaneHelper'
import { initScene, initSpritesGroup, initSpritesProjectionLinesGroup } from './initScene'

function onWindowResize(
  canvasElement: HTMLCanvasElement,
  renderer: WebGLRenderer,
  overlayRenderer: CSS2DRendererForReactComponent,
  camera: PerspectiveCamera) {
  const { width, height } = canvasElement.getBoundingClientRect()

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  overlayRenderer.setSize(width, height)
}

function onPointerMove(
  event: PointerEvent,
  canvasElement: HTMLCanvasElement,
  hoveredObjects: { [key: string]: (Sprite | null) },
  selectedObjects: { [key: string]: (Sprite | null) },
  pointer: Vector2,
  raycaster: Raycaster,
  camera: PerspectiveCamera,
  spritesGroup: Group,
  pointerDotElement: HTMLDivElement,
  colorTheme: PreferedColorTheme
) {
  if (hoveredObjects.last) {
    let color = colorTheme === COLOR_THEME_DARK ? SPRITE_COLOR_DARK_THEME : SPRITE_COLOR_LIGHT_THEME

    if (hoveredObjects.last === selectedObjects.last) {
      color = colorTheme === COLOR_THEME_DARK ? SPRITE_COLOR_SELECTED_COLOR_DARK_THEME : SPRITE_COLOR_SELECTED_COLOR_LIGHT_THEME
    }

    hoveredObjects.last.material.color.set(color)
    hoveredObjects.last = null
  }

  const { top, left, width, height } = canvasElement.getBoundingClientRect()

  const x = event.clientX - left
  const y = event.clientY - top

  pointerDotElement.style.transform = `translate( ${x}px, ${y}px )`

  pointer.x = (x / width) * 2 - 1
  pointer.y = ((y / height) * 2 - 1) * -1

  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObject(spritesGroup, true)

  if (intersects.length > 0) {
    const res = intersects.filter(function (res) {
      return res && res.object
    })[0]

    if (res && res.object) {
      hoveredObjects.last = res.object as Sprite

      const newColor = colorTheme === COLOR_THEME_DARK ? SPRITE_COLOR_HOVERED_COLOR_DARK_THEME : SPRITE_COLOR_HOVERED_COLOR_LIGHT_THEME

      hoveredObjects.last.material.color.set(newColor)
    }
  }
}

function onPointerClick(
  event: MouseEvent,
  canvasElement: HTMLCanvasElement,
  hoveredObjects: { [key: string]: (Sprite | null) },
  selectedObjects: { [key: string]: (Sprite | null) },
  pointer: Vector2,
  raycaster: Raycaster,
  camera: PerspectiveCamera,
  spritesGroup: Group,
  pointerDotElement: HTMLDivElement,
  colorTheme: PreferedColorTheme,
  onSelectItem: (item: MovingEntity | Location | PlanetarySystem) => void
) {
  if (selectedObjects.last) {
    const color = colorTheme === COLOR_THEME_DARK ? SPRITE_COLOR_DARK_THEME : SPRITE_COLOR_LIGHT_THEME

    selectedObjects.last.material.color.set(color)
    selectedObjects.last = null
  }

  const { top, left, width, height } = canvasElement.getBoundingClientRect()

  const x = event.clientX - left
  const y = event.clientY - top

  pointerDotElement.style.transform = `translate( ${x}px, ${y}px )`

  pointer.x = (x / width) * 2 - 1
  pointer.y = ((y / height) * 2 - 1) * -1

  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObject(spritesGroup, true)

  if (intersects.length > 0) {
    const res = intersects.filter(function (res) {
      return res && res.object
    })[0]

    if (res && res.object) {
      selectedObjects.last = res.object as Sprite

      const newColor = colorTheme === COLOR_THEME_DARK ? SPRITE_COLOR_SELECTED_COLOR_DARK_THEME : SPRITE_COLOR_SELECTED_COLOR_LIGHT_THEME

      selectedObjects.last.material.color.set(newColor)

      onSelectItem(res.object.userData.item)
    }
  }
}

function onAnimationFrame(
  renderer: WebGLRenderer,
  overlayRenderer: CSS2DRendererForReactComponent,
  mapZoomLevelLabel: HTMLDivElement,
  scene: Scene,
  camera: PerspectiveCamera,
  cameraControls: OrbitControls
) {
  renderer.render(scene, camera)
  overlayRenderer.render(scene, camera)

  const zoomLevel = getZoomLevel(cameraControls)

  mapZoomLevelLabel.innerText = `zoom: ${zoomLevel.toFixed(3)}x`
}

function getZoomLevel(cameraControls: OrbitControls) {
  return cameraControls.target.distanceTo(cameraControls.object.position)
}

export function initMapRenderer({
  canvasElement,
  mapZoomLevelLabel,
  overlayElement,
  pointerDotElement,
  colorTheme,
  onSelectItem,
}: {
  canvasElement: HTMLCanvasElement
  overlayElement: HTMLDivElement
  mapZoomLevelLabel: HTMLDivElement
  pointerDotElement: HTMLDivElement
  colorTheme: PreferedColorTheme
  onSelectItem: (item: MovingEntity | Location | PlanetarySystem) => void
}) {
  const hoveredObjects: { [key: string]: (Sprite | null) } = { last: null }
  const selectedObjects: { [key: string]: (Sprite | null) } = { last: null }

  const { renderer, overlayRenderer } = initRenderer(canvasElement, overlayElement)

  const scene = initScene(colorTheme)
  const spritesGroup = initSpritesGroup(scene)
  const spritesProjectionLinesGroup = initSpritesProjectionLinesGroup(scene)

  const camera = initCamera()
  const cameraControls = initCameraControls(renderer, camera)

  const planeHelper = initPlaneHelper({ scene, colorTheme })

  function renderFrame() {
    onAnimationFrame(renderer, overlayRenderer, mapZoomLevelLabel, scene, camera, cameraControls)
  }

  const raycaster = new Raycaster()
  const pointer = new Vector2()

  function handleWindowResize() {
    onWindowResize(canvasElement, renderer, overlayRenderer, camera)
  }

  function handlePointerMove(event: PointerEvent) {
    onPointerMove(event, canvasElement, hoveredObjects, selectedObjects, pointer, raycaster, camera, spritesGroup, pointerDotElement, colorTheme)
    renderFrame()
  }

  function handlePointerClick(event: MouseEvent) {
    onPointerClick(event, canvasElement, hoveredObjects, selectedObjects, pointer, raycaster, camera, spritesGroup, pointerDotElement, colorTheme, onSelectItem)
    renderFrame()
  }

  window.addEventListener('resize', handleWindowResize)
  canvasElement.addEventListener('pointermove', handlePointerMove)
  canvasElement.addEventListener('click', handlePointerClick)
  cameraControls.addEventListener('change', renderFrame)

  handleWindowResize()

  function destroyMapRenderer() {
    renderer.setAnimationLoop(null)
    window.removeEventListener('resize', handleWindowResize)
    canvasElement.removeEventListener('pointermove', handlePointerMove)
    canvasElement.removeEventListener('click', handlePointerClick)
    cameraControls.removeEventListener('change', renderFrame)
    cameraControls.dispose()
    renderer.dispose()
  }

  return {
    renderer,
    overlayRenderer,
    scene,
    spritesGroup,
    spritesProjectionLinesGroup,
    planeHelper,
    camera,
    cameraControls,
    renderFrame,
    destroyMapRenderer,
  }
}

function initRenderer(
  canvasElement: HTMLCanvasElement,
  overlayElement: HTMLDivElement
) {
  const renderer = init3DRenderer(canvasElement)
  const overlayRenderer = initOverlayRenderer(overlayElement)

  return { renderer, overlayRenderer }
}

function initOverlayRenderer(overlayElement: HTMLDivElement) {
  const renderer = new CSS2DRendererForReactComponent({ element: overlayElement, isUsingZOrder: false })

  renderer.setSize(window.innerWidth, window.innerHeight)
  return renderer
}

function init3DRenderer(canvasElement: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ antialias: true, canvas: canvasElement })

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  return renderer
}
