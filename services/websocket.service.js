const { Server } = require("socket.io");
const messageModel = require("../models/messageModel");

const WebSocketService = (server, parentLogger) => {
  const io = new Server(server, {
    path: "/ws",
    cors: {
      origin: "*",
      // credentials: true
    },
  });

  const logger = parentLogger.getSubLogger({ name: "WebSocketLogger" });
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    logger.info("Socket connected: ", socket.id);

    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
      logger.info("User added: ", userId);
    });

    socket.on("msg-send", async (data) => {
      logger.info(`Sending message 📨 from ${data.from} to ${data.to}`);

      const sendUserSocket = onlineUsers.get(data.to);
      await messageModel.create({
        message: {
          text: data.message,
        },
        users: [data.from, data.to],
        sender: data.from,
      });
      if (sendUserSocket) {
        logger.info(`${data.to} will receive the message shortly`);
        io.to(sendUserSocket).emit("msg-recieve", data);
      }
    });
  });
};

module.exports = WebSocketService;
