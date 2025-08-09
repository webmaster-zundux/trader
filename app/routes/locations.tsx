import { LocationsPage } from '~/pages/LocationsPage/LocationsPage'
import { PAGE_TITLE_LOCATIONS } from '~/pages/LocationsPage/LocationsPage.const'
import { createPageTitleString } from './utils/createPageTitleString'

export function meta() {
  return [
    { title: createPageTitleString(PAGE_TITLE_LOCATIONS) },
  ]
}

export default function Locations() {
  return <LocationsPage />
}
