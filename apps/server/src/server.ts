import express from "express";
import { Socket } from "socket.io";

const HOST = "LOCALHOST";
const PORT = 5000;

// app
const app = express();

// Body parser
app.use(express.json());

// Express body parser
app.use(express.urlencoded({ extended: true }));

const server = app.listen(PORT, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket: Socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("call", (data) => {
    io.to(data.userToCall).emit("call", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answer", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});
