
const express = require("express");
require("dotenv").config();
require("./db");
const morgan = require("morgan");
const port = process.env.PORT || 3300;
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const {Server} = require("socket.io");
const cors = require("cors");
const http = require("http");

const app = express();
app.use(cors());
const apiSeedUrl = '/api/v1';
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);

app.use(`${apiSeedUrl}/user`, userRoutes);
app.use(`${apiSeedUrl}/message`, messageRoutes);

 app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});   

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected: ", socket.id);
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});


