import { createPageTitleString } from '~/routes/utils/createPageTitleString'
import { Main } from '../components/Main'

const title = createPageTitleString('History')

export function HistoryPage() {
  return (
    <>
      <title>{title}</title>

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
