import { StaticLink } from '~/components/StaticLink'
import { createPageTitleWithAppName } from '~/routes/utils/createPageTitleWithAppName'
import { Main } from '../components/Main'
import { TicTacToeGame } from '../components/TicTacToeGame'
import styles from './NoMatchPage.module.css'

const pageTitle = createPageTitleWithAppName('404 page not found')

export function NoMatchPage() {
  return (
    <>
      <title>{pageTitle}</title>

      <Main>
        <div className={styles.Content}>
          <h2>404 - page not found</h2>
          <p>
            <StaticLink href="/">
              Go to the home page
            </StaticLink>
          </p>

          <TicTacToeGame />
        </div>
      </Main>
    </>
  )
}
