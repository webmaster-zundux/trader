import { StaticLink } from '~/components/StaticLink'
import { Main } from '../components/Main'
import { TicTacToeGame } from '../components/TicTacToeGame'
import styles from './NoMatchPage.module.css'

export function NoMatchPage() {
  return (
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
  )
}
