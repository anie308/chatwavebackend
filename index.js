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
const { Logger } = require("tslog");
const WebSocketService = require("./services/websocket.service");
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//     credentials: true,
//   },
// });

const logger = new Logger();
WebSocketService(server, logger);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
