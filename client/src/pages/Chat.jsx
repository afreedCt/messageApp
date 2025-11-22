import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import UserChat from "../components/userChat.jsx";
import { socket } from "../socket.js";
import { appContext } from "../contextAPI/useContext.jsx";

const Chat = () => {
  // const [userData, setUserData] = useState(null);

  const { userData, onlineUsers, setOnlineUsers, setUserData } =
    useContext(appContext);
  console.log(onlineUsers);

  const [showChat, setShowChat] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(sessionStorage.getItem("user"));

    if (!loggedUser) {
      navigate("/");
      return;
    }

    setUserData(loggedUser);

    const handleConnect = () => {
      socket.emit("user_connected", loggedUser.username);
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

  // useEffect(() => {
  //   socket.on("online_users", (users) => {
  //     setOnlineUsers(users);
  //   });

  //   return () => socket.off("online_users");
  // }, []);
  return (
    <div className="d-flex flex-grow-1">
      <Sidebar showChat={showChat} setShowChat={setShowChat} />
      <div
        className={`flex-grow-1 d-flex flex-column ${
          showChat ? "d-block" : "d-none d-md-block"
        }`}
      >
        <UserChat setShowChat={setShowChat} />
      </div>
    </div>
  );
};

export default Chat;
