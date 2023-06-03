const express = require("express");
require("dotenv").config();
require("./db");
const morgan = require("morgan");
const port = process.env.PORT || 3300;
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");

const app = express();
const socket = require("socket.io");
app.use(cors());
const apiSeedUrl = "/api/v1";
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));


app.use(`${apiSeedUrl}/user`, userRoutes);
app.use(`${apiSeedUrl}/message`, messageRoutes);

const server  = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
    // methods: ["GET", "POST"],
  },
});

// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   console.log("Socket connected: ", socket.id);
//   socket.on("add-user", (userId) => {
//     global.onlineUsers.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     console.log("Hello")
//     const sendUserSocket = global.onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       io.to(sendUserSocket).emit("msg-recieve", data.message);
//     }
//   });
// });

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
