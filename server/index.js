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

// io.on("connection", (socket) => {

//   socket.on("user_connected", (username) => {
//     userSocketMap[username] = socket.id;
//     socket.username = username;
//     io.emit("online_users", Object.keys(userSocketMap));
//     console.log("User connected:", username); 
//     // console.log("User socket map:", userSocketMap);
//   });

//   socket.on("join_private", ({ user1, user2 }) => {
//     const room = [user1, user2].sort().join("_");
//     socket.join(room);
//     // console.log("user socket map:", userSocketMap);
//     console.log(`${socket.username} joined ${room}`);
//   });

//   socket.on("send_message", (data) => {
//     console.log("data",data)
//     const room = data.room;
//     messages.push(data);
//     console.log("mesagges : ",messages)
//     io.to(room).emit("receive_message", data);
//     console.log("Message sent to room:", room, data);
//   });

//   socket.on("disconnect", () => {
//     if (socket.username) {
//       delete userSocketMap[socket.username];
//       io.emit("online_users", Object.keys(userSocketMap));
//     }
//     console.log("User disconnected:", socket.id,userSocketMap);
//   });
// });


server.listen(3000, () => {
  console.log("Server running on 5000");
});
