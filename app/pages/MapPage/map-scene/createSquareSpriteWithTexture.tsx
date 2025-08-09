import { Sprite, SpriteMaterial, type ColorRepresentation, type Vector3 } from 'three'
import { getPngTextureLoader } from '~/utils/getPngTextureLoader'

export function createSquareSpriteWithTexture({
  textureAsString,
  name,
  position,
  materialColor,
}: {
  textureAsString: string
  name: string
  position: Vector3
  materialColor?: ColorRepresentation
}) {
  const texture = getPngTextureLoader().load(textureAsString)
  const material = new SpriteMaterial({
    map: texture,
    color: materialColor,
    transparent: true,
    depthTest: false,
  })
  const sprite = new Sprite(material)

  sprite.name = name
  sprite.position.copy(position)

  sprite.addEventListener('removed', function onRemoved() {
    sprite.material.dispose()
    sprite.geometry.dispose()
  })

  return sprite
}
