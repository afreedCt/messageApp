import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllUsersAPI } from "../server/allAPI";

export const appContext = createContext();

export const Context = ({ children }) => {
  const [friends, setFriends] = useState([]);

  const [currentChat, setCurrentChat] = useState(null);
  const [userData, setUserData] = useState(
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : ""
  );
  const [messages, setMessages] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const fetchAllFriends = async () => {
    try {
      const res = await getAllUsersAPI(userData.id);
      //   console.log("Friends list", res);
      if (res.status === 200) {
        setFriends(
          res.data.users
            .map((u) => u.username)
            .filter((u) => u !== userData.username)
        );
      }
    } catch (error) {
      toast.error("Failed to fetch friends : " + error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchAllFriends();
    }
  }, [userData]);

  const value = {
    friends,
    setFriends,
    currentChat,
    setCurrentChat,
    userData,
    setUserData,
    messages,
    setMessages,
    onlineUsers,
    setOnlineUsers
  };

  return <appContext.Provider value={value}>{children}</appContext.Provider>;
};



