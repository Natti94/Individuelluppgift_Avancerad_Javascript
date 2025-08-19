import { useState, useEffect } from "react";
import { postMessages, getUserMessages, deleteMessages } from "../../Services";
import { mockMessages } from "./mock/mock";
import SideNav from "../sideNav/sideNav";

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function Chat() {
  const [sendMessage, setSendMessage] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [error, setError] = useState(null);
  const [botAvatar] = useState(() => {
    let stored = sessionStorage.getItem("botAvatar");
    if (stored) return stored;
    const randomId = Math.floor(Math.random() * 70) + 1;
    const url = `https://i.pravatar.cc/40?img=${randomId}`;
    sessionStorage.setItem("botAvatar", url);
    return url;
  });

  // Get logged-in username & avatar from JWT in sessionStorage
  let loggedInUsername = "You";
  let loggedInAvatar =
    sessionStorage.getItem("avatar") || "https://i.pravatar.cc/40";

  const jwt = sessionStorage.getItem("jwtToken");
  const jwtPayload = parseJwt(jwt);
  if (jwtPayload) {
    loggedInUsername =
      jwtPayload.username || jwtPayload.user || jwtPayload.name || "You";
    if (jwtPayload.avatar) {
      loggedInAvatar = jwtPayload.avatar;
      sessionStorage.setItem("avatar", loggedInAvatar);
    }
  }

  function sanitize(str) {
    return str.replace(/<[^>]*>?/gm, "");
  }

  useEffect(() => {
    async function fetchMessages() {
      try {
        let messages = (await getUserMessages()) || mockMessages;

        const storedMsgId = localStorage.getItem("msgId");
        const storedLastMsg = localStorage.getItem("lastMessage");
        console.log(
          "Latest stored msgId:",
          storedMsgId,
          "lastMessage:",
          storedLastMsg
        );

        const myUser = (loggedInUsername || "").trim().toLowerCase();

        messages = messages.map((msg) => {
          const msgUser = (msg.username || "").trim().toLowerCase();
          if (msgUser && msgUser === myUser) {
            return {
              ...msg,
              username: "You",
              isUser: true,
              avatar: loggedInAvatar,
            };
          } else {
            return {
              ...msg,
              username: "SupportBot",
              isUser: false,
              avatar: msg.avatar || "https://i.pravatar.cc/40",
            };
          }
        });

        setUserMessages(messages);
        setError(null);
      } catch {
        setUserMessages(mockMessages);
        setError(null);
      }
    }
    fetchMessages();
  }, [loggedInUsername, loggedInAvatar]);

  async function handleSendMessage(e) {
    e.preventDefault();
    const trimmed = sendMessage.trim();
    if (!trimmed) return;

    try {
      const newMsg = {
        id: Date.now().toString(),
        text: trimmed,
        createdAt: new Date().toISOString(),
        isUser: true,
        username: "You",
        avatar: loggedInAvatar,
      };
      setUserMessages((prev) => [...prev, newMsg]);
      setSendMessage("");

      setTimeout(() => {
        const botMsg = {
          id: (Date.now() + 1).toString(),
          text: "Auto-response: Thanks for your message!",
          createdAt: new Date().toISOString(),
          isUser: false,
          username: "SupportBot",
          avatar: botAvatar,
        };
        setUserMessages((prev) => [...prev, botMsg]);
      }, 1000);

      setError(null);
      await postMessages(trimmed);
    } catch {
      setError("Failed to send message. Please try again.");
    }
  }

  async function handleDeleteMessage(msgId) {
    try {
      await deleteMessages(msgId);
      setUserMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch {
      setError("Failed to delete message.");
    }
  }

  return (
    <div className="chat-page-root">
      <div className="chat-container">
        <h1>Chat</h1>

        <div className="messages-list">
          {userMessages.length === 0 ? (
            <p className="empty">No messages yet.</p>
          ) : (
            userMessages.map((message) => {
              const isUser = message.isUser;
              return (
                <div
                  key={message.id}
                  className={`message-row ${isUser ? "user-row" : "bot-row"}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    marginBottom: 18,
                  }}
                >
                  <img
                    src={message.avatar}
                    alt={isUser ? "Your avatar" : `${message.username} avatar`}
                    className="avatar"
                    style={{
                      marginRight: isUser ? 0 : 12,
                      marginLeft: isUser ? 12 : 0,
                    }}
                  />
                  <div
                    className={`message-bubble ${
                      isUser ? "user-message" : "other-message"
                    }`}
                    style={{
                      position: "relative",
                      marginLeft: isUser ? "auto" : 0,
                      marginRight: isUser ? 0 : "auto",
                    }}
                  >
                    {isUser && (
                      <button
                        className="delete-btn"
                        style={{ top: 6, right: 10, position: "absolute" }}
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        ×
                      </button>
                    )}
                    <p style={{ marginBottom: 4 }}>{sanitize(message.text)}</p>
                    <span className="timestamp">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input">
          <input
            type="text"
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)}
            placeholder="Type your message here..."
            className="chat-message-input"
            autoComplete="off"
          />
          <button type="submit">Send</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      <SideNav />
    </div>
  );
}

export default Chat;
