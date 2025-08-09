import { Object3D, Vector2 } from 'three'

/**
 * Uses existing html element in DOM that rendered as ReactComponent.
 * Does not delete html element from DOM when receives event 'removed',
 * that ReactRender will do.
 *
 * The only type of 3D object that is supported by {@link CSS2DRenderer}.
 *
 * @augments Object3D
 * @three_import import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
 */
export class CSS2DObjectForReactComponent extends Object3D {
  isCSS2DObjectForReactComponent: boolean
  isCSS2DObject: boolean
  element: HTMLElement
  center: Vector2

  /**
   * Constructs a new CSS2D object.
   *
   * @param {DOMElement} [element] - The DOM element.
   */
  constructor(element: HTMLElement) {
    super()

    /**
     * This flag can be used for type testing.
     *
     * @type {boolean}
     * @readonly
     * @default true
     */
    this.isCSS2DObjectForReactComponent = true

    /**
     * This flag can be used for type testing.
     *
     * @type {boolean}
     * @readonly
     * @default true
     */
    this.isCSS2DObject = true

    /**
     * The DOM element which defines the appearance of this 3D object.
     *
     * @type {DOMElement}
     * @readonly
     * @default true
     */
    this.element = element

    this.element.style.position = 'absolute'
    this.element.style.userSelect = 'none'

    this.element.setAttribute('draggable', 'false')

    /**
     * The 3D objects center point.
     * `( 0, 0 )` is the lower left, `( 1, 1 )` is the top right.
     *
     * @type {Vector2}
     * @default (0.5,0.5)
     */
    this.center = new Vector2(0.5, 0.5)

    // note: disabled because html element life-cycle managed by ReactComponent
    // this.addEventListener( 'removed', function () {
    //
    //   this.traverse( function ( object ) {
    //
    //     if (
    //       object.element instanceof object.element.ownerDocument.defaultView.Element &&
    //       object.element.parentNode !== null
    //     ) {
    //
    //       object.element.remove();
    //
    //     }
    //
    //   } );
    //
    // } );
  }

  copy(source: CSS2DObjectForReactComponent, recursive?: boolean) {
    super.copy(source, recursive)

    // note: disabled because html element life-cycle managed by ReactComponent
    // this.element = source.element.cloneNode(true)
    this.element = source.element

    this.center = source.center

    return this
  }
}

export function isCSS2DObjectForReactComponent(value: unknown): value is CSS2DObjectForReactComponent {
  return ((value as CSS2DObjectForReactComponent)?.isCSS2DObjectForReactComponent)
}
