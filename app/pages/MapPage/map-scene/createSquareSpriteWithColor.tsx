import { Sprite, SpriteMaterial, type ColorRepresentation, type Vector3 } from 'three'

export function createSquareSpriteWithColor({
  color = 'orange', name, position,
}: {
  color?: ColorRepresentation
  name: string
  position: Vector3
}) {
  const material = new SpriteMaterial({ color })
  const sprite = new Sprite(material)

  sprite.name = name
  sprite.position.copy(position)

  sprite.addEventListener('removed', function onRemoved() {
    sprite.material.dispose()
    sprite.geometry.dispose()
  })

  return sprite
}
