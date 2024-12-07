import React, { useState } from "react";
import "./App.css";

const App = () => {
  // State to manage the grid size for the board (default is 3x3)
  const [gridSize, setGridSize] = useState(3);

  // State to manage the win streak (number of consecutive marks to win)
  const [winStreak, setWinStreak] = useState(3);

  // State to manage the current state of the game board
  const [board, setBoard] = useState([]);

  // State to track the current player ("X" or "O")
  const [currentPlayer, setCurrentPlayer] = useState("X");

  // State to track the winner (null if no winner, "X", "O", or "Draw")
  const [winner, setWinner] = useState(null);

  // State to determine if the game has started
  const [gameStarted, setGameStarted] = useState(false);

  // Function to initialize the game board based on grid size
  const initializeBoard = () => {
    // Create a gridSize x gridSize empty board
    setBoard(
      Array(gridSize)
        .fill()
        .map(() => Array(gridSize).fill(""))
    );
    setWinner(null); // Reset winner to null
    setCurrentPlayer("X"); // Start with player "X"
    setGameStarted(true); // Mark game as started
  };

  // Function to handle a cell click during the game
  const handleCellClick = (row, col) => {
    // Prevent actions if cell is already filled or a winner is declared
    if (board[row][col] !== "" || winner) return;

    // Update the board with the current player's mark
    const updatedBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? currentPlayer : cell))
    );

    setBoard(updatedBoard); // Update the board state
    checkWinner(updatedBoard, row, col, currentPlayer); // Check if the move resulted in a winner
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X")); // Switch to the next player
  };

  // Function to check if there is a winner or a draw
  const checkWinner = (board, row, col, player) => {
    // Define the directions to check (horizontal, vertical, diagonal, anti-diagonal)
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal \
      [1, -1], // Anti-diagonal /
    ];

    // Check all directions for a win streak
    for (let [dx, dy] of directions) {
      let count = 1; // Start with the current cell

      // Check in both forward and backward directions
      for (let dir of [-1, 1]) {
        let x = row + dir * dx; // Move along rows
        let y = col + dir * dy; // Move along columns

        // Count consecutive cells matching the player's mark
        while (
          x >= 0 &&
          y >= 0 &&
          x < gridSize &&
          y < gridSize &&
          board[x][y] === player
        ) {
          count++;
          if (count >= winStreak) {
            setWinner(player); // Declare the player as the winner
            return;
          }
          x += dir * dx;
          y += dir * dy;
        }
      }
    }

    // Check if all cells are filled and declare a draw if no winner
    if (board.flat().every((cell) => cell !== "")) {
      setWinner("Draw");
    }
  };

  // Function to reset the game and return to the settings screen
  const resetGame = () => {
    setGameStarted(false); // Mark game as not started
    setBoard([]); // Clear the board
    setWinner(null); // Reset winner
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center py-8">
      {/* Main heading */}
      <h1 className="text-4xl font-bold mb-6">Customizable Tic-Tac-Toe</h1>

      {/* Game settings (before the game starts) */}
      {!gameStarted && (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Game Settings</h2>

          {/* Input for grid size */}
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

          {/* Input for win streak */}
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

          {/* Button to start the game */}
          <button
            onClick={initializeBoard}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      )}

      {/* Game screen (after the game starts) */}
      {gameStarted && (
        <div className="flex flex-col items-center w-full">
          {/* Display current player or game result */}
          <h2 className="text-2xl mb-4">
            {winner
              ? winner === "Draw"
                ? "It's a Draw!"
                : `Player ${winner} Wins!`
              : `Current Player: ${currentPlayer}`}
          </h2>

          {/* Render the game board */}
          <div
            className={`grid gap-2`}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`, // Dynamically set columns based on grid size
            }}
          >
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  className="bg-gray-700 hover:bg-gray-600 text-3xl font-bold h-16 w-16 flex items-center justify-center rounded"
                  onClick={() => handleCellClick(i, j)}
                >
                  {cell} {/* Display the player's mark */}
                </button>
              ))
            )}
          </div>

          {/* Button to reset the game */}
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
