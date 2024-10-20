import './App.css'
import {useState} from "react";
import confetti from "canvas-confetti"

const TURNS = {X: '❌', O: '⭕'}

const WINNER_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const Square = ({children, isSelected, updateBoard, index}) => {
    const className = `square ${isSelected ? 'is-selected' : ''}`
    const handleClick = () => {
        updateBoard(index)
    }
    return (
        <div onClick={handleClick} className={className}>
            {children}
        </div>
    )
}

function App() {
    const [board, setBoard] = useState(
        Array(9).fill(null)
    )
    const [turn, setTurn] = useState(TURNS.X)
    /*NULL = NO HAY GANADOR
    * FALSE = HAY UN EMPATE*/
    const [winner, setWinner] = useState(null)

    const checkWinner = (boardToCheck) => {
        /*SE REVISAN TODAS LAS COMBINACIONES GANADORAS
        * PARA VER QUIÉN DE LOS DOS HA GANADO (X u O)*/
        for (const combo of WINNER_COMBOS) {
            const [a, b, c] = combo
            if (
                boardToCheck[a] &&
                boardToCheck[a] === boardToCheck[b] &&
                boardToCheck[a] === boardToCheck[c]
            ) {
                return boardToCheck[a]
            }
        }
        /*SI NO HAY GANADOR*/
        return null
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setTurn(TURNS.X)
        setWinner(null)
    }

    /*ESTO CHECKEA QUE NO HAYAN CASILLAS VACÍAS*/
    const checkEndGame = (newBoard) => {
        return newBoard.every((square) => square !== null)
    }

    const updateBoard = (index) => {
        /*NO SE ACTUALIZA SI YA HAY ALGO EN LA CASILLA
        * O SI HAY UN GANADOR*/
        if (board[index] || winner) return
        /*ACTUALIZA EL TABLERO*/
        const newBoard = [...board]
        newBoard[index] = turn
        setBoard(newBoard)
        /*CAMBIA EL TURNO*/
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
        setTurn(newTurn)
        const newWinner = checkWinner(newBoard)
        /*LA ACTUALIZACIÓN DE ESTADOS ES ASÍNCRONA*/
        if (newWinner) {
            confetti()
            setWinner(newWinner)
        } else if (checkEndGame(newBoard)) {
            setWinner(false)
        }

    }

    return (
        <main className='board'>
            <h1>TicTacToe</h1>
            <button onClick={resetGame}>Reset Game</button>
            <section className='game'>
                {
                    board.map((_, index) => {
                        return (
                            <Square
                                key={index}
                                index={index}
                                updateBoard={updateBoard}
                            >
                                {board[index]}
                            </Square>
                        )
                    })
                }
            </section>
            <section className="turn">
                <Square isSelected={turn === TURNS.X}>
                    {TURNS.X}
                </Square>
                <Square isSelected={turn === TURNS.O}>
                    {TURNS.O}
                </Square>
            </section>

            {
                winner !== null && (
                    <section className="winner">
                        <div className="text">
                            <h2>
                                {
                                    winner === false
                                        ? 'Draw'
                                        : 'Winner:'
                                }
                            </h2>

                            <header className="win">
                                {winner && <Square>{winner}</Square>}
                            </header>

                            <footer>
                                <button onClick={resetGame}>New Game</button>
                            </footer>
                        </div>
                    </section>
                )
            }

        </main>
    )
}

export default App
