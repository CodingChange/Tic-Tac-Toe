export const getEmptyBoard = () => [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

export const updateBoard = (
  board: string[][],
  outerIndex: number,
  innerIndex: number,
  value: "O" | "X"
) => {
  board[outerIndex][innerIndex] = value;

  return board;
};

export const checkDraw = (board: string[][]) => {
  for (const row of board) {
    for (const cell of row) {
      if (cell === "") {
        return false;
      }
    }
  }

  return true;
};

export const checkWin = (board: string[][], player: "O" | "X") => {
  // Left diagonal
  if (
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player
  ) {
    return true;
  }

  // Right diagonal
  if (
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === player
  ) {
    return true;
  }

  // First row
  if (
    board[0][0] === player &&
    board[0][1] === player &&
    board[0][2] === player
  ) {
    return true;
  }

  // Second row
  if (
    board[1][0] === player &&
    board[1][1] === player &&
    board[1][2] === player
  ) {
    return true;
  }

  // Third row
  if (
    board[2][0] === player &&
    board[2][1] === player &&
    board[2][2] === player
  ) {
    return true;
  }

  // First column
  if (
    board[0][0] === player &&
    board[1][0] === player &&
    board[2][0] === player
  ) {
    return true;
  }

  // Second column
  if (
    board[0][1] === player &&
    board[1][1] === player &&
    board[2][1] === player
  ) {
    return true;
  }

  // Third column
  if (
    board[0][2] === player &&
    board[1][2] === player &&
    board[2][2] === player
  ) {
    return true;
  }
};
