import { TextureLoader } from 'three'

let pngTextureLoader: TextureLoader | undefined = undefined

export function getPngTextureLoader(): TextureLoader {
  if (!pngTextureLoader) {
    pngTextureLoader = new TextureLoader()
  }

  return pngTextureLoader
}
