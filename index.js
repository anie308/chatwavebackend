const express = require("express");
require("dotenv").config();
require("./db");
const morgan = require("morgan");
const port = process.env.PORT || 3300;
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
// const socket = require("socket.io");
const cors = require("cors");


const app = express();
app.use(cors());
const apiSeedUrl = '/api/v1';
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));


app.use(`${apiSeedUrl}/user`, userRoutes);
app.use(`${apiSeedUrl}/message`, messageRoutes);


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });   

  // const server = require('http').createServer(app);

  // const io = socket(server, {
  //   cors: {
  //     origin: "*",
  //     credentials: true,
  //     methods: ["GET", "POST"],
  //   },
  // })


  // global.onlineUser = new Map();

  // io.on("connection", (socket) => {
  //   global.chatSocket = socket;
  //   socket.on("add-user",(userId)=>{
  //     onlineUser.set(userId,socket.id);
  //   })

  //   socket.on("send-msg", (data) => {
  //     const sendUserSocket = onlineUsers.get(data.to);
  //     if(sendUserSocket){
  //       io.to(sendUserSocket).emit("msg-recieve",data.msg);
  //     }
  //   })
  // })