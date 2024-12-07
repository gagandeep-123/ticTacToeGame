import React, { useState } from "react";

const App = () => {
  // State variables to manage game configuration and status
  const [gridSize, setGridSize] = useState(3); // Size of the grid (n x n)
  const [winStreak, setWinStreak] = useState(3); // Number of consecutive marks needed to win
  const [board, setBoard] = useState([]); // The game board (2D array)
  const [currentPlayer, setCurrentPlayer] = useState("X"); // Current player (X or O)
  const [winner, setWinner] = useState(null); // Stores the winner (X, O or "Draw")
  const [gameStarted, setGameStarted] = useState(false); // To track if the game has started

  // Initializes a new game board
  const initializeBoard = () => {
    setBoard(
      Array(gridSize) // Creates a grid of size n x n
        .fill()
        .map(() => Array(gridSize).fill("")) // Fills each cell with an empty string
    );
    setWinner(null); // Reset the winner
    setCurrentPlayer("X"); // Reset to player X
    setGameStarted(true); // Set game started to true
  };

  // Handles the click event on a cell of the board
  const handleCellClick = (row, col) => {
    if (board[row][col] !== "" || winner) return; // Ignore if the cell is already filled or game is over

    const updatedBoard = board.map(
      (r, i) =>
        r.map((cell, j) => (i === row && j === col ? currentPlayer : cell)) // Update the clicked cell
    );

    setBoard(updatedBoard); // Set the updated board
    checkWinner(updatedBoard, row, col, currentPlayer); // Check if the current move wins the game
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X")); // Switch the current player
  };

  // Checks for a winner after each move
  const checkWinner = (board, row, col, player) => {
    const directions = [
      [0, 1], // Horizontal direction
      [1, 0], // Vertical direction
      [1, 1], // Diagonal direction (bottom-left to top-right)
      [1, -1], // Diagonal direction (top-left to bottom-right)
    ];

    for (let [dx, dy] of directions) {
      let count = 1; // Start with the current cell

      for (let dir of [-1, 1]) {
        // Check both directions (left/right, up/down, etc.)
        let x = row + dir * dx;
        let y = col + dir * dy;

        // Check if the cell is within the grid and matches the current player's mark
        while (
          x >= 0 &&
          y >= 0 &&
          x < gridSize &&
          y < gridSize &&
          board[x][y] === player
        ) {
          count++; // Increment the streak count
          if (count >= winStreak) {
            setWinner(player); // Set the winner if the streak is enough
            return;
          }
          x += dir * dx; // Move in the current direction
          y += dir * dy;
        }
      }
    }

    // Check if all cells are filled and there is no winner, set as "Draw"
    if (board.flat().every((cell) => cell !== "")) {
      setWinner("Draw");
    }
  };

  // Resets the game to its initial state
  const resetGame = () => {
    setGameStarted(false); // Set gameStarted to false
    setBoard([]); // Clear the board
    setWinner(null); // Reset winner
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-6">Customizable Tic-Tac-Toe</h1>

      {/* Display game settings if the game hasn't started */}
      {!gameStarted && (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Game Settings</h2>
          {/* Grid size input */}
          <div className="mb-4">
            <label className="block mb-2">Grid Size (n x n):</label>
            <input
              type="number"
              min="3"
              max="10"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))} // Update grid size
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>
          {/* Win streak input */}
          <div className="mb-4">
            <label className="block mb-2">Win Streak (m):</label>
            <input
              type="number"
              min="3"
              max={gridSize}
              value={winStreak}
              onChange={(e) => setWinStreak(Number(e.target.value))} // Update win streak
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>
          <button
            onClick={initializeBoard} // Initialize the board when clicked
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      )}

      {/* Display game board if the game has started */}
      {gameStarted && (
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl mb-4">
            {winner
              ? winner === "Draw"
                ? "It's a Draw!" // If it's a draw
                : `Player ${winner} Wins!` // Display the winner
              : `Current Player: ${currentPlayer}`}{" "}
            {/* Display current player */}
          </h2>
          {/* Render the game board */}
          <div
            className={`grid gap-2`}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`, // Create a grid with dynamic columns
            }}
          >
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  className="bg-gray-700 hover:bg-gray-600 text-3xl font-bold h-16 w-16 flex items-center justify-center rounded"
                  onClick={() => handleCellClick(i, j)} // Handle cell click
                >
                  {cell} {/* Display the cell's content */}
                </button>
              ))
            )}
          </div>
          <button
            onClick={resetGame} // Reset the game when clicked
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
