const MAP_TEXTURE_FOLDER_PATH = `/images/textures`

export function createTexturePath(
  textureName: string
) {
  return `${import.meta.env.BASE_URL}${MAP_TEXTURE_FOLDER_PATH}/${textureName}.png`
}
