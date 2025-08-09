import { createPageTitleString } from '~/routes/utils/createPageTitleString'
import { Main } from '../components/Main'

const title = createPageTitleString('Inventory')

export function InventoryPage() {
  return (
    <>
      <title>{title}</title>

      <Main>
        <h1 style={{ textTransform: 'capitalize' }}>
          inventory page
        </h1>

        <div className="info-panel"></div>
        <div className="info-panel"></div>
      </Main>
    </>
  )
}
