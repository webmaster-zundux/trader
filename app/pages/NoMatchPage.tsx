import { StaticLink } from '~/components/StaticLink'
import { createPageTitleString } from '~/routes/utils/createPageTitleString'
import { Main } from '../components/Main'
import { TicTacToeGame } from '../components/TicTacToeGame'
import styles from './NoMatchPage.module.css'

const title = createPageTitleString('404 page not found')

export function NoMatchPage() {
  return (
    <>
      <title>{title}</title>

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
