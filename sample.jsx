import React, { useEffect, useState } from "react";
import { socket } from "../socket.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllUsersAPI, registerAPI } from "../server/allAPI.js";

const Chat = () => {
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState({});
  const [friends, setFriends] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");

  console.log(friends);

  const navigate = useNavigate();
  // ===========================
  // 1. Check if logged in
  // ===========================
  useEffect(() => {
    const loggedUser = sessionStorage.getItem("user");
    if (!loggedUser) {
      navigate("/");
    } else {
      setUserData(JSON.parse(loggedUser));
      setUser(JSON.parse(loggedUser).username);
    }
  }, []);

  // ===========================
  // 2. When user is set, connect to socket
  // ===========================
  //   useEffect(() => {
  //     if (!user) return;

  //     socket.emit("user_connected", user);

  //     // Receive messages from backend
  //     socket.on("receive_message", (data) => {
  //       setMessages((prev) => [...prev, data]);
  //     });

  //     return () => {
  //       socket.off("receive_message");
  //     };
  //   }, [user]);

  const fetchAllFriends = async () => {
    try {
      const res = await getAllUsersAPI(user);
      console.log("Friends list", res.data.users);
      if (res.status === 200) {
        console.log("setting");
        setFriends(res.data.users.map(u => u.username).filter(u => u !== user));
      }
    } catch (error) {
      toast.error("Failed to fetch friends : " + error.message);
    }
  };
  useEffect(() => {
    fetchAllFriends();
  }, []);

  // ===========================
  // 4. Start private chat with a friend
  // ===========================
  const startChat = (friend) => {
    setCurrentChat(friend);
    setMessages([]);

    socket.emit("join_private", {
      user1: user,
      user2: friend,
    });
  };

  // ===========================
  // 5. Send message
  // ===========================
  const sendMessage = () => {
    if (!msgInput.trim()) return;

    const messageData = {
      room: [user, currentChat].sort().join("_"),
      from: user,
      text: msgInput,
      time: new Date().toLocaleTimeString(),
    };

    console.log("messageData ", messageData);

    socket.emit("send_message", messageData);

    setMessages((prev) => [...prev, messageData]);
    setMsgInput("");
  };

  // ===========================
  // UI
  // ===========================
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* ============== LEFT SIDEBAR ============== */}
      <div style={{ width: "45%", background: "#f4f4f4", padding: 20 }}>
        <h3>Welcome {user}</h3>

        <h4 style={{ marginTop: 20 }}>Friends</h4>
        {friends.map((f) => (
          <div
            key={f}
            onClick={() => startChat(f)}
            style={{
              padding: 10,
              marginTop: 8,
              cursor: "pointer",
              background: currentChat === f ? "#ddd" : "#fff",
              border: "1px solid #ccc",
            }}
          >
            {f}
          </div>
        ))}
      </div>

      {/* ============== CHAT AREA ============== */}
      <div style={{ width: "55%", padding: 20 }}>
        {currentChat ? (
          <>
            <h2>Chat with {currentChat}</h2>
            <div
              style={{
                border: "1px solid #ccc",
                height: "70vh",
                padding: 10,
                overflowY: "auto",
                marginTop: 10,
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    background: msg.from === user ? "#d1ffd6" : "#fff",
                    padding: 8,
                    margin: "6px 0",
                    borderRadius: 6,
                    textAlign: msg.from === user ? "right" : "left",
                  }}
                >
                  <div>
                    <strong>{msg.from}</strong>
                  </div>
                  <div>{msg.text}</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>{msg.time}</div>
                </div>
              ))}
            </div>

            {/* Input box */}
            <div
              style={{ marginTop: 15, display: "flex", gap: 10, width: "100%" }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 5,
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: "10px 20px",
                  background: "black",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <h2>Select a friend to start chatting</h2>
        )}
      </div>
    </div>
  );
};

export default Chat;