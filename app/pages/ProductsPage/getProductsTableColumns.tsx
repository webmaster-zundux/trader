import type { Column } from '../../components/Table'
import type { Product } from '../../models/entities/Product'
import { FormattedProductRarityNameForProduct } from './tables/FormattedCells/FormattedProductRarityNameForProduct'
import { FormattedProductTypeNameForProduct } from './tables/FormattedCells/FormattedProductTypeNameForProduct'
import { ProductNameActionButtonsForProduct } from './tables/FormattedCells/ProductNameActionButtonsForProduct'
import { sortItemsByProductRarityName } from './tables/sortBy/sortItemsByProductRarityName'
import { sortItemsByProductTypeName } from './tables/sortBy/sortItemsByProductTypeName'

export function getProductsTableColumns(): Column<Product>[] {
  return [
    {
      name: 'uuid',
      isCheckbox: true,
    },
    {
      name: `name`,
      asLinkToEditItem: true,
      isSortable: true,
      alignLabel: 'left',
      actionButtons: ProductNameActionButtonsForProduct,
    },
    {
      name: `productTypeUuid`,
      label: 'type',
      isSortable: true,
      formatValue: FormattedProductTypeNameForProduct,
      sortFn: sortItemsByProductTypeName,
    },
    {
      name: `productRarityUuid`,
      label: `rarity`,
      isSortable: true,
      sort: 'asc',
      formatValue: FormattedProductRarityNameForProduct,
      sortFn: sortItemsByProductRarityName,
    },
  ]
}
