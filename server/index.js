const express = require("express");
const dotenv=require('dotenv')
dotenv.config()
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB  = require("./config/dbConfig");
const setupSocket = require('./controllers/webSocketController')

const app = express();
connectDB()
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

let messages = [];

app.use("/api", require("./routes/router"));

const userSocketMap = {};

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setupSocket(io)

const PORT=process.env.PORT

server.listen(PORT, () => {
  console.log("Server running on "+PORT);
});
