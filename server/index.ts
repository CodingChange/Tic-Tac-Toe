import { createServer } from "http";
import { Server } from "socket.io";

import {
  checkDraw,
  checkWin,
  getEmptyBoard,
  updateBoard,
} from "./game/game-logic";

const httpServer = createServer();
const port = process.env.PORT || 3000;
const io = new Server(httpServer, { cors: { origin: "*" } });
const rooms = new Map<
  string,
  { playerO?: string; playerX?: string; turn?: "O" | "X"; board: string[][] }
>();

const generateRoomId = () => {
  const roomId = Math.floor(100000 + Math.random() * 900000).toString();
  if (rooms.has(roomId)) {
    return generateRoomId();
  }

  return roomId;
};

io.on("connection", (socket) => {
  socket.on("create-room", () => {
    const roomId = generateRoomId();

    rooms.set(
      roomId,
      Math.random() > 0.5
        ? { playerO: socket.id, board: getEmptyBoard() }
        : { playerX: socket.id, board: getEmptyBoard() }
    );

    socket.join(roomId);
    socket.data = { roomId };

    io.to(socket.id).emit("room-created", { roomId });
  });

  socket.on("join-room", ({ roomId }) => {
    const roomDetails = rooms.get(roomId);
    if (!roomDetails) {
      return io.to(socket.id).emit("error", { error: "Room does not exist" });
    }

    if (roomDetails.playerO && roomDetails.playerX) {
      return io.to(socket.id).emit("error", { error: "Room is already full" });
    }

    if (
      roomDetails.playerO === socket.id ||
      roomDetails.playerX === socket.id
    ) {
      return io
        .to(socket.id)
        .emit("error", { error: "You are already in the room" });
    }

    socket.join(roomId);
    socket.data = { roomId };

    rooms.set(
      roomId,
      roomDetails.playerO
        ? {
            ...roomDetails,
            turn: Math.random() > 0.5 ? "O" : "X",
            playerX: socket.id,
          }
        : {
            ...roomDetails,
            playerO: socket.id,
            turn: Math.random() > 0.5 ? "O" : "X",
          }
    );

    io.to(roomId).emit("user-joined");

    io.to(roomId).emit("start-game", {
      turn: rooms.get(roomId)?.turn,
      playerO: rooms.get(roomId)?.playerO,
      board: rooms.get(roomId)?.board,
    });
  });

  socket.on("player-move", ({ outerIndex, innerIndex, roomId }) => {
    const roomDetails = rooms.get(roomId);

    if (!roomDetails) {
      return io.to(socket.id).emit("error", { error: "Room does not exist" });
    }

    if (roomDetails.board[outerIndex][innerIndex] === "") {
      return io
        .to(socket.id)
        .emit("error", { error: "Position is already marked" });
    }

    if (
      (roomDetails.playerO === socket.id && roomDetails.turn !== "O") ||
      (roomDetails.playerX === socket.id && roomDetails.turn !== "X")
    ) {
      return io.to(socket.id).emit("error", {
        error: "Its not your turn. Please wait for your turn",
      });
    }

    roomDetails.board = updateBoard(
      roomDetails.board,
      outerIndex,
      innerIndex,
      roomDetails.playerO === socket.id ? "O" : "X"
    );

    roomDetails.turn = roomDetails.turn === "O" ? "X" : "O";

    rooms.set(roomId, roomDetails);

    io.to(roomId).emit("update-board", {
      turn: roomDetails.turn,
      board: roomDetails.board,
    });

    if (checkWin(roomDetails.board, "O")) {
      io.to(roomDetails.playerO!).emit("victory");
      io.to(roomDetails.playerX!).emit("loss");

      rooms.delete(roomId);

      return;
    }

    if (checkWin(roomDetails.board, "X")) {
      io.to(roomDetails.playerX!).emit("victory");
      io.to(roomDetails.playerO!).emit("loss");

      rooms.delete(roomId);

      return;
    }

    if (checkDraw(roomDetails.board)) {
      io.to(roomId).emit("draw");

      rooms.delete(roomId);

      return;
    }
  });

  socket.on("disconnect", () => {
    const { roomId } = socket.data;
    if (roomId && rooms.has(roomId)) {
      io.to(roomId).emit("player-disconnected");
      rooms.delete(roomId);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Socket server listening on http://localhost:${port}`);
});
