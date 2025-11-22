import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllUsersAPI, getMessagesAPI } from "../server/allAPI";
import { appContext } from "../contextAPI/useContext";
import { socket } from "../socket.js";
import { useNavigate } from "react-router-dom";

const Sidebar = ({showChat,setShowChat}) => {
  const {
    friends,
    setFriends,
    currentChat,
    setCurrentChat,
    userData,
    setUserData,
    messages,
    setMessages,
    onlineUsers
  } = useContext(appContext);


  const [show,setShow]=useState(true)

  const navigate=useNavigate()

  useEffect(() => setUserData(JSON.parse(sessionStorage.getItem("user"))), []);

  const startChat = async (friend) => {
    setCurrentChat(friend);
    setShowChat(true)
    const room = [userData.username, friend].sort().join("_");

    // console.log("user data : ",userData)

    socket.emit("join_private", { user1: userData.username, user2: friend });

    try {
      const res = await getMessagesAPI(room);
      // console.log(res.data)
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  

  return (
    <div className={`bg-light min-vh-100 d-md-block sidebar ${showChat?'d-none':''}`} >
      <h2 className="fw-bold text-center my-3">Welcome {userData?.username}</h2>

      <h4 className="fs-3 my-2 mx-2 text-center">All Friends</h4>

      <div className="d-flex flex-column align-items-stretch justify-content-between" style={{height:"80vh"}}>
        <div className="d-flex flex-column gap-1 ">
          {friends.map((friend, index) => (
            <div
              key={index}
              className={`p-2 mx-2 my-1 rounded cursor  ${
                currentChat === friend ? "bg-primary text-white" : "bg-white"
              } ${onlineUsers.includes(friend)?"border border-success border-1":""}`}
              onClick={() => startChat(friend)}
            >
              {friend}
            </div>
          ))}
        </div>

        <div
          className="btn btn-light m-2 mt-5"
          onClick={() => {
            sessionStorage.removeItem("user");
            setUserData(null);
            navigate('/')
            socket.disconnect();
          }}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
