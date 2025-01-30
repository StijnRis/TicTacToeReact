import { useState } from "react";

function Square({ value, color, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick} style={{ color }}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares, i);
    }

    const { winner, places } = calculateWinner(squares);
    let status;
    if (winner != null) {
        status = "Winner: " + winner;
    } else if (!squares.includes(null)) {
        status = "It's a draw!";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    const board = [];
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;

            row.push(
                <Square
                    key={index}
                    value={squares[index]}
                    color={winner && places.includes(index) ? "green" : "black"}
                    onSquareClick={() => handleClick(index)}
                />
            );
        }

        board.push(
            <div key={i} className="board-row">
                {row}
            </div>
        );
    }

    return (
        <>
            <div className="status">{status}</div>
            {board}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [movePositions, setMovePositions] = useState([]);
    const [currentMove, setCurrentMove] = useState(0);
    const [movesAscending, setMovesAscending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares, position) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        const nextMovePositions = [
            ...movePositions.slice(0, currentMove + 1),
            position,
        ];
        setHistory(nextHistory);
        setMovePositions(nextMovePositions);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        if (movesAscending) {
            move = move;
        } else {
            move = history.length - 1 - move;
        }

        const row = Math.floor(movePositions[move - 1] / 3) + 1;
        const col = (movePositions[move - 1] % 3) + 1;
        const pos = " (" + row + ", " + col + ")";

        let description;
        if (move === 0) {
            description = "Go to game start";
        } else if (move === currentMove) {
            return (
                <li key={move} className="history-item">
                    You are at move #{move} {pos}
                </li>
            );
        } else {
            description = "Go to move #" + move + pos;
        }

        return (
            <li key={move} className="history-item">
                <button className="history-button" onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className="game-info">
                <button onClick={() => setMovesAscending(!movesAscending)}>
                    {movesAscending ? "Sort Descending" : "Sort Ascending"}
                </button>
                <ul>{moves}</ul>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return { winner: squares[a], places: lines[i] };
        }
    }
    return { winner: null, places: [] };
}
