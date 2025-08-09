import type { Camera, Object3D, Scene } from 'three'
import { Matrix4, Vector3 } from 'three'
import type { CSS2DObjectForReactComponent } from './CSS2DObjectForReactComponent'

const _vector = new Vector3()
const _viewMatrix = new Matrix4()
const _viewProjectionMatrix = new Matrix4()
const _a = new Vector3()
const _b = new Vector3()

/**
 * Uses existing html element in DOM that rendered as ReactComponent.
 * It does not delete html element from DOM when receives event 'removed',
 * because ReactRender will do it.
 *
 * Added parameter isUsingZOrder to allow do NOT use css rule 'z-index'
 * when html elements updates (e.g. when all elements has transparent background)
 *
 * This renderer is a simplified version of {@link CSS3DRenderer}. The only transformation that is
 * supported is translation.
 *
 * The renderer is very useful if you want to combine HTML based labels with 3D objects. Here too,
 * the respective DOM elements are wrapped into an instance of {@link CSS2DObject} and added to the
 * scene graph. All other types of renderable 3D objects (like meshes or point clouds) are ignored.
 *
 * `CSS2DRenderer` only supports 100% browser and display zoom.
 *
 * @three_import import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
 */
export class CSS2DRendererForReactComponent {
  domElement: HTMLElement
  isUsingZOrder: boolean
  getSize: () => { width: number, height: number }
  render: (scene: Scene, camera: Camera) => void
  setSize: (width: number, height: number) => void

  /**
   * Constructs a new CSS2D renderer.
   *
   * @param {CSS2DRenderer~Parameters} [parameters] - The parameters.
   */
  constructor(parameters: { element: HTMLElement, isUsingZOrder?: boolean }) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this

    let _width: number, _height: number
    let _widthHalf: number, _heightHalf: number

    const cache = {
      objects: new WeakMap()
    }

    // note: behaviour changed because html element life-cycle managed by ReactComponent
    const domElement = parameters.element // !== undefined ? parameters.element : document.createElement('div')

    domElement.style.overflow = 'hidden'

    /**
     * The DOM where the renderer appends its child-elements.
     *
     * @type {DOMElement}
     */
    this.domElement = domElement

    this.isUsingZOrder = !!parameters.isUsingZOrder

    /**
     * Returns an object containing the width and height of the renderer.
     *
     * @return {{width:number,height:number}} The size of the renderer.
     */
    this.getSize = function getSize() {
      return {
        width: _width,
        height: _height
      }
    }

    /**
     * Renders the given scene using the given camera.
     *
     * @param {Object3D} scene - A scene or any other type of 3D object.
     * @param {Camera} camera - The camera.
     */
    this.render = function render(scene, camera) {
      if (scene.matrixWorldAutoUpdate === true) {
        scene.updateMatrixWorld()
      }

      if (camera.parent === null && camera.matrixWorldAutoUpdate === true) {
        camera.updateMatrixWorld()
      }

      _viewMatrix.copy(camera.matrixWorldInverse)
      _viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, _viewMatrix)

      // @ts-expect-error need usage of generic type
      renderObject(scene, scene, camera, this.isUsingZOrder)

      if (this.isUsingZOrder) {
        zOrder(scene)
      }
    }

    /**
     * Resizes the renderer to the given width and height.
     *
     * @param {number} width - The width of the renderer.
     * @param {number} height - The height of the renderer.
     */
    this.setSize = function setSize(width, height) {
      _width = width
      _height = height

      _widthHalf = _width / 2
      _heightHalf = _height / 2

      domElement.style.width = width + 'px'
      domElement.style.height = height + 'px'
    }

    function hideObject(object: CSS2DObjectForReactComponent) {
      if (object.isCSS2DObject) {
        object.element.style.display = 'none'
      }

      for (let i = 0, l = object.children.length; i < l; i++) {
        // @ts-expect-error need usage of generic type
        hideObject(object.children[i])
      }
    }

    function renderObject(object: CSS2DObjectForReactComponent, scene: Scene, camera: Camera, isUsingZOrder: boolean) {
      if (object.visible === false) {
        hideObject(object)

        return
      }

      if (object.isCSS2DObject) {
        _vector.setFromMatrixPosition(object.matrixWorld)
        _vector.applyMatrix4(_viewProjectionMatrix)

        const visible = (_vector.z >= -1 && _vector.z <= 1) && (object.layers.test(camera.layers) === true)

        const element = object.element

        element.style.display = visible === true ? '' : 'none'

        if (visible === true) {
          // @ts-expect-error need usage of generic type
          object.onBeforeRender(_this, scene, camera)

          element.style.transform = 'translate(' + (-100 * object.center.x) + '%,' + (-100 * object.center.y) + '%)' + 'translate(' + (_vector.x * _widthHalf + _widthHalf) + 'px,' + (-_vector.y * _heightHalf + _heightHalf) + 'px)'

          // note: disabled because html element life-cycle managed by ReactComponent
          // if (element.parentNode !== domElement) {
          //   domElement.appendChild(element)
          // }

          // @ts-expect-error need usage of generic type
          object.onAfterRender(_this, scene, camera)
        }

        if (isUsingZOrder) {
          const objectData = {
            distanceToCameraSquared: getDistanceToSquared(camera, object)
          }

          cache.objects.set(object, objectData)
        }
      }

      for (let i = 0, l = object.children.length; i < l; i++) {
        // @ts-expect-error need usage of generic type
        renderObject(object.children[i], scene, camera, isUsingZOrder)
      }
    }

    function getDistanceToSquared(object1: Object3D, object2: Object3D) {
      _a.setFromMatrixPosition(object1.matrixWorld)
      _b.setFromMatrixPosition(object2.matrixWorld)

      return _a.distanceToSquared(_b)
    }

    function filterAndFlatten(scene: Scene) {
      const result: CSS2DObjectForReactComponent[] = new Array<CSS2DObjectForReactComponent>()

      scene.traverseVisible(function (object) {
        // @ts-expect-error need usage of generic type
        if (object.isCSS2DObject) result.push(object)
      })

      return result
    }

    function zOrder(scene: Scene) {
      const sorted = filterAndFlatten(scene).sort(function (a, b) {
        if (a.renderOrder !== b.renderOrder) {
          return b.renderOrder - a.renderOrder
        }

        const distanceA = cache.objects.get(a).distanceToCameraSquared
        const distanceB = cache.objects.get(b).distanceToCameraSquared

        return distanceA - distanceB
      })

      const zMax = sorted.length

      for (let i = 0, l = sorted.length; i < l; i++) {
        sorted[i].element.style.zIndex = `${zMax - i}`
      }
    }
  }
}
