import type { MouseEventHandler } from 'react'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import styles from './TicTacToeGame.module.css'

const SQUARE_VALUE_X = 'X' as const
const SQUARE_VALUE_O = 'O' as const

type SquareValue = typeof SQUARE_VALUE_X | typeof SQUARE_VALUE_O | null
type BoardState = SquareValue[]
type History = BoardState[]

type State = {
  history: History
  currentMove: number
}

type Actions = {
  setHistory: (nextHistory: History | ((history: History) => History)) => void
  setCurrentMove: (nextCurrentMove: number | ((currentMove: number) => number)) => void
}

const useGameStore = create<State & Actions>(
  combine(
    {
      history: [Array<SquareValue>(9).fill(null)],
      currentMove: 0,
    } satisfies State,
    (set) => {
      return {
        setHistory: (nextHistory) => {
          set(state => ({
            history:
              typeof nextHistory === 'function'
                ? nextHistory(state.history)
                : nextHistory,
          }))
        },
        setCurrentMove: (nextCurrentMove) => {
          set(state => ({
            currentMove:
              typeof nextCurrentMove === 'function'
                ? nextCurrentMove(state.currentMove)
                : nextCurrentMove,
          }))
        },
      }
    }
  )
)

function calculateWinner(squares: BoardState) {
  const lines = [
    // horizontal lines
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // vertical lines
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]

    if (
      squares[a]
      && squares[a] === squares[b]
      && squares[a] === squares[c]
    ) {
      return squares[a]
    }
  }

  return null
}

function calculateTurns(squares: BoardState) {
  return squares.filter(square => !square).length
}

function calculateStatus(
  winner: SquareValue,
  turns: number,
  player: SquareValue
) {
  if (!winner && !turns) {
    return `draw`
  }

  if (winner) {
    return `winner ${winner}`
  }

  return `next player: ${player}`
}

interface SquareProps {
  value: SquareValue
  onSquareClick: MouseEventHandler<HTMLButtonElement>
}
function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button
      className={styles.Square}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

interface BoardProps {
  xIsNext: boolean
  squares: BoardState
  onPlay: (square: SquareValue[]) => void
}
function Board({ xIsNext, squares, onPlay }: BoardProps) {
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? SQUARE_VALUE_X : SQUARE_VALUE_O
  const status = calculateStatus(winner, turns, player)

  function handleClick(squareIndex: number) {
    if (squares[squareIndex] || winner) {
      return
    }

    const nextSquares = squares.slice()

    nextSquares[squareIndex] = player
    onPlay(nextSquares)
  }

  return (
    <>
      <div className={styles.Status}>
        {status}
      </div>
      <div className={styles.Grid}>
        {squares.map((square, squareIndex) => (
          <Square
            key={`square-${squareIndex}`}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}

export function TicTacToeGame() {
  const history = useGameStore(state => state.history)
  const setHistory = useGameStore(state => state.setHistory)
  const currentMove = useGameStore(state => state.currentMove)
  const setCurrentMove = useGameStore(state => state.setCurrentMove)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares: BoardState) {
    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares])

    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
  }

  return (
    <div className={styles.GameContainer}>
      <h3 className={styles.GameHeader}>
        Tic Tac Toe game
      </h3>

      <div className={styles.Game}>
        <div>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>

        <div className={styles.History}>
          <ol className={styles.HistoryList}>
            {history.map((_, historyIndex) => {
              const jumpToHistoryStepLabel = historyIndex > 0
                ? `go to move #${historyIndex}`
                : `go to game start`

              return (
                <li
                  key={historyIndex}
                  className={styles.HistoryRecord}
                >
                  <button
                    className={styles.HistoryRecordButton}
                    onClick={() => jumpTo(historyIndex)}
                  >
                    {jumpToHistoryStepLabel}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

      </div>
    </div>
  )
}

// type CountState = {
//   count: number
// }

// type CountReducerActions = {
//   increment: (delta: number) => void
//   decrement: (delta: number) => void
// }

// type CountReducerAction = {
//   type: keyof CountReducerActions
//   // data: Parameters<CountActions[keyof CountActions]>[number]
//   delta: number
// }

// function countReducer(state: CountState, action: CountReducerAction) {
//   switch (action.type) {
//     case 'increment':
//       return { ...state, count: state.count + action.delta }

//     case 'decrement':
//       return { ...state, count: state.count - action.delta }

//     default:
//       return state
//   }
// }

// type CountActions = {
//   dispatch: (action: CountReducerAction) => void
// }

// const useCountStore = create<CountState & CountActions>(set => ({
//   count: 0,
//   dispatch: (action: CountReducerAction) => set(state => countReducer(state, action)),
// }))
