import { useCallback, useEffect, useRef, useState } from 'react'
import type { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { type Location } from '~/models/entities/Location'
import { type MovingEntity } from '~/models/entities/MovingEntity'
import { type PlanetarySystem } from '~/models/entities/PlanetarySystem'
import { useColorTheme } from '~/stores/simple-stores/ColorTheme.store'
import type { CSS2DRendererForReactComponent } from '../map-scene/CSS2DRendererForReactComponent'
import { initMapRenderer } from '../map-scene/initMapRenderer'
import type { MapPlaneHelper } from '../map-scene/MapPlaneHelper'
import { FORCED_MAP_RENDER_FRAME_DELAY_IN_MS, type MapMode } from '../Map.const'
import { useChangingSceneSpriteGroupEffect } from './useChangingSceneSpriteGroupEffect'
import { useChangingSelectedItemOnMapEffect } from './useChangingSelectedItemOnMapEffect'
import { useResetCamera } from './useResetCamera'

interface useInitializationMapRendererProps {
  items: (MovingEntity | Location | PlanetarySystem)[]
  mode: MapMode
  onSelectItem: (item: MovingEntity | Location | PlanetarySystem) => void
  selectedItemUuid?: (MovingEntity | Location | PlanetarySystem)['uuid']
}
export function useMapRenderer({
  mode,
  items,
  onSelectItem,
  selectedItemUuid,
}: useInitializationMapRendererProps) {
  const colorTheme = useColorTheme(state => state.colorTheme)

  const rendererRef = useRef<WebGLRenderer>(null)
  const overlayRendererRef = useRef<CSS2DRendererForReactComponent>(null)
  const sceneRef = useRef<Scene>(null)
  const spritesGroupRef = useRef<Group>(null)
  const spritesProjectionLinesGroupRef = useRef<Group>(null)
  const planeHelperRef = useRef<MapPlaneHelper>(null)
  const cameraControlsRef = useRef<OrbitControls>(null)
  const cameraRef = useRef<PerspectiveCamera>(null)
  const [noDataToDisplay, setNoDataToDisplay] = useState(false)
  const mapCanvasRef = useRef<HTMLCanvasElement>(null)
  const pointerDotRef = useRef<HTMLDivElement>(null)
  const mapOverlayContainerRef = useRef<HTMLDivElement>(null)
  const mapZoomLevelLabelRef = useRef<HTMLDivElement>(null)

  const [frameRenderCallback, setFrameRenderCallback] = useState<(() => void) | undefined>(undefined)
  const renderFrame = useCallback(function renderFrame() {
    if (typeof frameRenderCallback === 'function') {
      window.setTimeout(function renderFrameTimeoutHandler() {
        if (typeof frameRenderCallback === 'function') {
          frameRenderCallback()
        }
      }, FORCED_MAP_RENDER_FRAME_DELAY_IN_MS)
    }
  }, [frameRenderCallback])

  const [onWindowResizeCallback, setOnWindowResizeCallback] = useState<(() => void) | undefined>(undefined)
  const onWindowResize = useCallback(function onWindowResize() {
    if (typeof onWindowResizeCallback === 'function') {
      onWindowResizeCallback()
    }
  }, [onWindowResizeCallback])

  useEffect(function initMapRendererEffect() {
    const canvasElement = mapCanvasRef.current

    if (!canvasElement) {
      console.error('Error. Map canvas as html element does not exist')
      return
    }

    const overlayElement = mapOverlayContainerRef.current

    if (!overlayElement) {
      console.error('Error. Map overlay as html element does not exist')
      return
    }

    const mapZoomLevelLabel = mapZoomLevelLabelRef.current

    if (!mapZoomLevelLabel) {
      console.error('Error. Map zoom level label as html element does not exist')
      return
    }

    const pointerDotElement = pointerDotRef.current

    if (!pointerDotElement) {
      console.error('Error. Map pointer dot as html element does not exist')
      return
    }

    const {
      renderer,
      overlayRenderer,
      scene,
      spritesGroup,
      spritesProjectionLinesGroup,
      planeHelper,
      camera,
      cameraControls,
      renderFrame,
      onWindowResize,
      destroyMapRenderer,
    } = initMapRenderer({ canvasElement, overlayElement, mapZoomLevelLabel, pointerDotElement, colorTheme, onSelectItem })

    rendererRef.current = renderer
    overlayRendererRef.current = overlayRenderer
    sceneRef.current = scene
    spritesGroupRef.current = spritesGroup
    spritesProjectionLinesGroupRef.current = spritesProjectionLinesGroup
    planeHelperRef.current = planeHelper
    cameraRef.current = camera
    cameraControlsRef.current = cameraControls
    setFrameRenderCallback(() => renderFrame)
    setOnWindowResizeCallback(() => onWindowResize)

    onWindowResize()
    renderFrame()

    return function initThreeJsRendererEffectCleanup() {
      rendererRef.current = null
      overlayRendererRef.current = null
      sceneRef.current = null
      spritesGroupRef.current = null
      cameraControlsRef.current = null
      planeHelperRef.current = null
      cameraRef.current = null
      cameraControlsRef.current = null
      setFrameRenderCallback(undefined)
      destroyMapRenderer()
    }
  }, [rendererRef, overlayRendererRef, mapCanvasRef, mapOverlayContainerRef, mapZoomLevelLabelRef, pointerDotRef, spritesGroupRef, spritesProjectionLinesGroupRef, planeHelperRef, cameraRef, cameraControlsRef, setFrameRenderCallback, colorTheme, onSelectItem])

  const resetCamera = useResetCamera({
    cameraControlsRef,
    cameraRef,
    spritesGroupRef,
  })

  useChangingSceneSpriteGroupEffect({
    spritesGroupRef,
    spritesProjectionLinesGroupRef,
    sceneRef,
    planeHelperRef,
    mapOverlayContainerRef,
    items,
    colorTheme,
    mode,
    setNoDataToDisplay,
    resetCamera,
    renderFrame
  })

  useChangingSelectedItemOnMapEffect({
    selectedItemUuid,
    spritesGroupRef,
    items,
    colorTheme,
    mode,
    renderFrame,
  })

  return {
    noDataToDisplay,
    mapCanvasRef,
    mapOverlayContainerRef,
    mapZoomLevelLabelRef,
    pointerDotRef,
    renderFrame,
    onWindowResize,
  }
}
