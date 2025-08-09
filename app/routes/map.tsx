import { MapPage } from '~/pages/MapPage/MapPage'
import { createPageTitleString } from './utils/createPageTitleString'

export function meta() {
  return [
    { title: createPageTitleString('Map') },
  ]
}

export default function Map() {
  return <MapPage />
}
