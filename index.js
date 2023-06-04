// const express = require("express");
// require("dotenv").config();
// require("./db");
// const morgan = require("morgan");
// const port = process.env.PORT || 3300;
// const userRoutes = require("./routes/userRoutes");
// const messageRoutes = require("./routes/messageRoutes");
// const cors = require("cors");
// const app = express();
// const socket = require("socket.io");
// app.use(cors());
// const apiSeedUrl = "/api/v1";
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());  
// app.use(morgan("dev"));
// app.use(express.urlencoded({ extended: true }));


// app.use(`${apiSeedUrl}/user`, userRoutes);
// app.use(`${apiSeedUrl}/message`, messageRoutes);

// const server  = app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

// const io = socket(server, {
//   cors: {
//     origin: "*",
//     credentials: true,
//     // methods: ["GET", "POST"],
//   },
// });

// // global.onlineUsers = new Map();

// // io.on("connection", (socket) => {
// //   console.log("Socket connected: ", socket.id);
// //   socket.on("add-user", (userId) => {
// //     global.onlineUsers.set(userId, socket.id);
// //   });

// //   socket.on("send-msg", (data) => {
// //     console.log("Hello")
// //     const sendUserSocket = global.onlineUsers.get(data.to);
// //     if (sendUserSocket) {
// //       io.to(sendUserSocket).emit("msg-recieve", data.message);
// //     }
// //   });
// // });

// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log("Hello")
//   });

//   socket.on("send-msg", (data) => {
//     console.log("sent",data)
//     const sendUserSocket = onlineUsers.get(data.to);
//     console.log("sendUserSocket",sendUserSocket)
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data.message);
//       console.log("recieve", data.message)
//     }
//   });
// });



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
    global.onlineUsers.set(userId, socket.id);
    console.log("User added: ", userId);
  });

  socket.on("send-msg", (data) => {
    console.log("Message sent:", data);
    const sendUserSocket = global.onlineUsers.get(data.to);
    console.log("sendUserSocket", sendUserSocket);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-recieve", data.message);
      console.log("Message received by", data.to);
    }
  }); 
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
