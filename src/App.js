import React, { useState } from "react";
import "./App.css";

const App = () => {
  // State to manage the grid size (n x n)
  const [gridSize, setGridSize] = useState(3);

  // State to manage the win streak (m)
  const [winStreak, setWinStreak] = useState(3);

  // State to represent the game board
  const [board, setBoard] = useState([]);

  // State to track the current player (either "X" or "O")
  const [currentPlayer, setCurrentPlayer] = useState("X");

  // State to track the winner of the game
  const [winner, setWinner] = useState(null);

  // State to track whether the game has started
  const [gameStarted, setGameStarted] = useState(false);

  // Function to initialize the board with an empty grid
  const initializeBoard = () => {
    // Create a 2D array of size gridSize x gridSize filled with empty strings
    setBoard(Array(gridSize).fill(Array(gridSize).fill("")));
    setWinner(null); // Reset the winner
    setCurrentPlayer("X"); // Start with player "X"
    setGameStarted(true); // Mark the game as started
  };

  // Function to handle cell clicks during the game
  const handleCellClick = (row, col) => {
    // If the cell is already occupied or the game has a winner, do nothing
    if (board[row][col] !== "" || winner) return;

    // Update the board with the current player's move
    const updatedBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? currentPlayer : cell))
    );

    setBoard(updatedBoard); // Update the board state
    checkWinner(updatedBoard, row, col, currentPlayer); // Check if there's a winner
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X")); // Switch the player
  };

  // Function to check for a winner or a draw
  const checkWinner = (board, row, col, player) => {
    // Define the directions to check: horizontal, vertical, diagonal, and anti-diagonal
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal \
      [1, -1], // Anti-diagonal /
    ];

    // Loop through each direction
    for (let [dx, dy] of directions) {
      let count = 1; // Start with the current cell as part of the streak

      // Check in both directions for a streak
      for (let dir of [-1, 1]) {
        let x = row + dir * dx; // Move along the row
        let y = col + dir * dy; // Move along the column

        // While within bounds and cells match the player's mark
        while (
          x >= 0 &&
          y >= 0 &&
          x < gridSize &&
          y < gridSize &&
          board[x][y] === player
        ) {
          count++; // Increment the streak count
          if (count >= winStreak) {
            setWinner(player); // Set the winner if the streak matches the win condition
            return;
          }
          x += dir * dx; // Continue in the same direction
          y += dir * dy;
        }
      }
    }

    // Check for a draw (no empty cells left and no winner)
    if (board.flat().every((cell) => cell !== "")) {
      setWinner("Draw");
    }
  };

  // Function to reset the game and go back to the settings screen
  const resetGame = () => {
    setGameStarted(false); // Mark the game as not started
    setBoard([]); // Clear the board
    setWinner(null); // Clear the winner
  };

  return (
    <div className="App">
      {/* Settings Screen (before the game starts) */}
      {!gameStarted && (
        <div className="settings">
          <h1>Customizable Tic-Tac-Toe</h1>
          {/* Input for grid size */}
          <label>
            Grid Size (n x n):
            <input
              type="number"
              min="3"
              max="10"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
            />
          </label>
          {/* Input for win streak */}
          <label>
            Win Streak (m):
            <input
              type="number"
              min="3"
              max={gridSize}
              value={winStreak}
              onChange={(e) => setWinStreak(Number(e.target.value))}
            />
          </label>
          {/* Button to start the game */}
          <button onClick={initializeBoard}>Start Game</button>
        </div>
      )}

      {/* Game Screen (after the game starts) */}
      {gameStarted && (
        <div className="game">
          {/* Display current player or winner */}
          <h2>
            {winner
              ? winner === "Draw"
                ? "It's a Draw!"
                : `Player ${winner} Wins!`
              : `Current Player: ${currentPlayer}`}
          </h2>
          {/* Render the board */}
          <div
            className="board"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`, // Adjust grid columns dynamically
            }}
          >
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className="cell"
                  onClick={() => handleCellClick(i, j)}
                >
                  {cell} {/* Display the cell content */}
                </div>
              ))
            )}
          </div>
          {/* Button to reset the game */}
          <button onClick={resetGame}>Reset Game</button>
        </div>
      )}
    </div>
  );
};

export default App;
