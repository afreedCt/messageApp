const { Message } = require("../Models/messageModel");

module.exports = (io) => {
  // let userSocketMap = {};
  const onlineUsers = new Map();
  io.on("connection", (socket) => {
    socket.on("user_connected", (username) => {
      // userSocketMap[username] = socket.id;
      socket.username = username;
      onlineUsers.set(socket.id, username);
      io.emit("online_users", [...onlineUsers.values()]);
      console.log("Online:", onlineUsers);
    });

    socket.on("join_private", ({ user1, user2 }) => {
      const room = [user1, user2].sort().join("_");
      socket.join(room);
      // socket.username = user1;
      //   console.log(`${socket.username} joined ${room}`);
    });

    socket.on("send_message", async (data) => {
      const room = data.room;

      await Message.create({
        room: data.room,
        sender: data.sender,
        content: data.content,
      });

      console.log("data", data);

      io.in(room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      if (socket.username) {
        // delete userSocketMap[socket.username];
        onlineUsers.delete(socket.id);
        // io.emit("online_users", Object.keys(userSocketMap));
        io.emit("online_users", [...onlineUsers.values()]);
      }
      console.log("User disconnected:", socket.id , "map : ",onlineUsers);
    });
  });
};
