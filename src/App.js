import React, { useState } from "react";
const App = () => {
  const [gridSize, setGridSize] = useState(3);
  const [winStreak, setWinStreak] = useState(3);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeBoard = () => {
    setBoard(
      Array(gridSize)
        .fill()
        .map(() => Array(gridSize).fill(""))
    );
    setWinner(null);
    setCurrentPlayer("X");
    setGameStarted(true);
  };

  const handleCellClick = (row, col) => {
    if (board[row][col] !== "" || winner) return;

    const updatedBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? currentPlayer : cell))
    );

    setBoard(updatedBoard);
    checkWinner(updatedBoard, row, col, currentPlayer);
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
  };

  const checkWinner = (board, row, col, player) => {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (let [dx, dy] of directions) {
      let count = 1;

      for (let dir of [-1, 1]) {
        let x = row + dir * dx;
        let y = col + dir * dy;

        while (
          x >= 0 &&
          y >= 0 &&
          x < gridSize &&
          y < gridSize &&
          board[x][y] === player
        ) {
          count++;
          if (count >= winStreak) {
            setWinner(player);
            return;
          }
          x += dir * dx;
          y += dir * dy;
        }
      }
    }

    if (board.flat().every((cell) => cell !== "")) {
      setWinner("Draw");
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setBoard([]);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-6">Customizable Tic-Tac-Toe</h1>

      {!gameStarted && (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Game Settings</h2>
          <div className="mb-4">
            <label className="block mb-2">Grid Size (n x n):</label>
            <input
              type="number"
              min="3"
              max="10"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Win Streak (m):</label>
            <input
              type="number"
              min="3"
              max={gridSize}
              value={winStreak}
              onChange={(e) => setWinStreak(Number(e.target.value))}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>
          <button
            onClick={initializeBoard}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl mb-4">
            {winner
              ? winner === "Draw"
                ? "It's a Draw!"
                : `Player ${winner} Wins!`
              : `Current Player: ${currentPlayer}`}
          </h2>
          <div
            className={`grid gap-2`}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  className="bg-gray-700 hover:bg-gray-600 text-3xl font-bold h-16 w-16 flex items-center justify-center rounded"
                  onClick={() => handleCellClick(i, j)}
                >
                  {cell}
                </button>
              ))
            )}
          </div>
          <button
            onClick={resetGame}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Reset Game
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
