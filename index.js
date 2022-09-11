const express = require("express");
const socket = require("socket.io");
const PORT = 5000;
const app = express();
const activeUsers = new Set();

const server = app.listen(process.env.PORT || PORT, function () {
  console.log(`Listening on port ${PORT}`);
  // console.log(`http://localhost:${PORT}`);
});

const io = socket(server);

// Static files
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Connected : " + socket.id);

  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
    console.log("Disconnected : " + socket.id);
  });

  socket.on("chat message", function (data) {
    io.emit("chat message", data);
    console.log(data);
  });

  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });

  socket.on("location", function (data) {
    io.emit("location", data);
    console.log(data);
  });

});
