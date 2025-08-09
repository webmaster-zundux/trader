const MAP_TEXTURE_FOLDER_PATH = `/images/textures`

export function createTexturePath(
  textureName: string
) {
  return `${MAP_TEXTURE_FOLDER_PATH}/${textureName}.png`
}
