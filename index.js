

const express = require("express");
require("dotenv").config();
require("./db");
const morgan = require("morgan");
const port = process.env.PORT || 3300;
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected: ", socket.id);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User added: ", userId);
  });

  socket.on("send-msg", (data) => {
    console.log("Message sent:", data.to);
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("sendUserSocket", sendUserSocket);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-recieve", data.message);
      console.log("Message received by", data.message);
    }
  }); 
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
