import { createPageTitleWithAppName } from '~/routes/utils/createPageTitleWithAppName'
import { Main } from '../components/Main'
import { TicTacToeGame } from '../components/TicTacToeGame'
import styles from './NoMatchPage.module.css'
import { InternalStaticLink } from '~/components/InternalStaticLink'

const pageTitle = createPageTitleWithAppName('404 page not found')

export function NoMatchPage() {
  return (
    <>
      <title>{pageTitle}</title>

      <Main>
        <div className={styles.Content}>
          <h2>404 - page not found</h2>
          <p>
            <InternalStaticLink to="/">
              Go to the home page
            </InternalStaticLink>
          </p>

          <TicTacToeGame />
        </div>
      </Main>
    </>
  )
}
