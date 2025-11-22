import React, { useContext, useEffect, useRef, useState } from "react";
import { appContext } from "../contextAPI/useContext";
import { socket } from "../socket";
import Moment from "moment";
import { Spinner } from "react-bootstrap";

const ChatWindow = ({ setShowChat }) => {
  const { currentChat, userData, messages, setMessages,messageLoading } =
    useContext(appContext);

  const [msgInput, setMsgInput] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!msgInput.trim() || !currentChat) return;
    const newMessage = {
      sender: userData.username,
      content: msgInput,
      room: [userData.username, currentChat].sort().join("_"),
    };
    // Emit message via socket
    socket.emit("send_message", newMessage);

    setMsgInput("");
  };

  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      console.log(msg)
    setMessages((prev) => [...prev, msg]);
  };

    socket.off("receive_message",handleIncomingMessage);
    socket.on("receive_message", handleIncomingMessage);

    return () => {
      socket.off("receive_message",handleIncomingMessage );
    };
  }, [currentChat]);

  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);


  return (
    <div
      className="flex-grow-1 d-flex flex-column p-2"
      style={{ height: "100vh" }}
    >
      <div>
        <button
          className="btn btn-light d-md-none mx-2 mt-3 fw-bold"
          onClick={() => setShowChat(false)}
        >
          ←
        </button>
      </div>
      {currentChat ? (
        <h3 className="text-center mt-2 fs-1 fw-bold">
          Chat with {currentChat}
        </h3>
      ) : (
        <h1 className="text-center mt-5 fs-1 fw-bold">No chat selected</h1>
      )}
      {
        messageLoading?
        <div className=" h-100 d-flex justify-content-center align-items-center">
            <Spinner variant="primary" animation="border" />
        </div>
        :
      <div className="d-flex flex-column justify-content-end">
        <div
          ref={messagesRef}
          className="flex-grow-1 msg-box"
          style={{ overflowY: "auto", }}
        >
          {messages.length === 0 && (
            <div className="d-flex h-75 justify-content-center align-items-center">
              <h1 className="text-center fw-bold">start the Conversation</h1>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex m-2 ${
                msg.sender === userData?.username
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.sender === userData?.username
                    ? "bg-light text-dark"
                    : "bg-grey text-white "
                }`}
                style={{
                  maxWidth: "75%",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {/* <strong>{msg.sender}:</strong> {msg.content} */}
                <h6 className="text-dark">{msg.content}</h6>
                <div className="text-end " style={{ fontSize: "10px" }}>
                  {Moment(msg.date).fromNow()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentChat && (
          <form action="">
            <div className="d-flex p-2">
              <input
                type="text"
                className="form-control me-2"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Type your message..."
              />
              <button
                className="btn btn-primary"
                onClick={(e) => handleSendMessage(e)}
              >
                Send
              </button>
            </div>
          </form>
        )}
      </div>
      }
    </div>
  );
};

export default ChatWindow;
