import { createPageTitleWithAppName } from '~/routes/utils/createPageTitleWithAppName'
import { Main } from '../components/Main'

const pageTitle = createPageTitleWithAppName('History')

export function HistoryPage() {
  return (
    <>
      <title>{pageTitle}</title>

      <Main>
        <h1 style={{ textTransform: 'capitalize' }}>
          history page
        </h1>

        <div className="info-panel"></div>
        <div className="info-panel"></div>
      </Main>
    </>
  )
}
