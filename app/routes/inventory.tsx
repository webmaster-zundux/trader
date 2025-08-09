import { InventoryPage } from '~/pages/InventoryPage'
import { createPageTitleString } from './utils/createPageTitleString'

export function meta() {
  return [
    { title: createPageTitleString('Inventory') },
  ]
}

export default function Inventory() {
  return <InventoryPage />
}
