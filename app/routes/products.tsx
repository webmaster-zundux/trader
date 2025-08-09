import { ProductsPage } from '~/pages/ProductsPage/ProductsPage'
import { PAGE_TITLE_PRODUCTS } from '~/pages/ProductsPage/ProductsPage.const'
import { createPageTitleString } from './utils/createPageTitleString'

export function meta() {
  return [
    { title: createPageTitleString(PAGE_TITLE_PRODUCTS) },
  ]
}

export default function Products() {
  return <ProductsPage />
}
