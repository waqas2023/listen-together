const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let roomState = {
  songUrl: "/song.mp3",
  currentTime: 0,
  isPlaying: false,
};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);
  socket.emit("sync-state", roomState);

  socket.on("play", (time) => {
    roomState.isPlaying = true;
    roomState.currentTime = time;
    socket.broadcast.emit("play", time);
  });

  socket.on("pause", (time) => {
    roomState.isPlaying = false;
    roomState.currentTime = time;
    socket.broadcast.emit("pause", time);
  });

  socket.on("seek", (time) => {
    roomState.currentTime = time;
    socket.broadcast.emit("seek", time);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});


