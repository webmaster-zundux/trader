import type { BufferGeometry } from 'three'
import { type ColorRepresentation, type Plane, CircleGeometry, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

type MapPlaneHelperShape = 'disk' | 'square'

export class MapPlaneHelper extends Mesh {
  plane: Plane
  size: number

  constructor(
    plane: Plane,
    size: number = 1,
    color: ColorRepresentation = 'black',
    opacity: number = 0.2,
    shape: MapPlaneHelperShape = 'disk'
  ) {
    let wireframeGeometry: BufferGeometry

    if (shape === 'disk') {
      wireframeGeometry = new CircleGeometry(1, 128)
    } else {
      wireframeGeometry = new PlaneGeometry(1, 1)
    }

    const material = new MeshBasicMaterial({
      color: color,
      opacity: opacity,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: DoubleSide
    })

    super(wireframeGeometry, material)

    // @ts-expect-error override value of class attribute 'type'
    this.type = 'PlaneHelper'

    this.plane = plane
    this.size = size
  }

  setSize(size: number) {
    this.size = size
    this.updateMatrixWorld()
  }

  setColor(color: ColorRepresentation) {
    // @ts-expect-error  Property 'color' does not exist on type 'Material | Material[]'
    this.material.color = color
  }

  setOpacity(opacity: number) {
    // @ts-expect-error  Property 'opacity' does not exist on type 'Material | Material[]'
    this.material.opacity = opacity
  }

  updateMatrixWorld(force?: boolean) {
    this.position.set(0, 0, 0)
    this.scale.set(0.5 * this.size, 0.5 * this.size, 1)
    this.lookAt(this.plane.normal)
    this.translateZ(-this.plane.constant)
    super.updateMatrixWorld(force)
  }

  dispose() {
    this.geometry.dispose()
    // @ts-expect-error - todo improve types
    this.material.dispose()
  }
}
