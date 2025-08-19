import { useState, useEffect } from "react";
import { postMessages, getUserMessages, deleteMessages } from "../../Services";
import { mockMessages } from "./mock/mock";
import SideNav from "../sideNav/sideNav";


function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function Chat() {
  const [sendMessage, setSendMessage] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [error, setError] = useState(null);
  // Get logged-in username from JWT in sessionStorage
  let loggedInUsername = "You";
  const jwt = sessionStorage.getItem("jwtToken");
  const jwtPayload = parseJwt(jwt);
  if (jwtPayload && (jwtPayload.username || jwtPayload.user || jwtPayload.name)) {
    loggedInUsername = (jwtPayload.username || jwtPayload.user || jwtPayload.name);
  }

  function sanitize(str) {
    return str.replace(/<[^>]*>?/gm, "");
  }

  useEffect(() => {
    async function fetchMessages() {
      try {
        let messages = (await getUserMessages()) || mockMessages;
        // Map messages: if from logged-in user, set username 'You' and isUser true, else 'SupportBot' and isUser false
        const myUser = (loggedInUsername || "").trim().toLowerCase();
        messages = messages.map((msg) => {
          const msgUser = (msg.username || "").trim().toLowerCase();
          if (msgUser && msgUser === myUser) {
            return { ...msg, username: "You", isUser: true };
          } else {
            return { ...msg, username: "SupportBot", isUser: false };
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
  }, [loggedInUsername]);

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
        };
        setUserMessages((prev) => [...prev, botMsg]);
      }, 1000);

      setError(null);
      await postMessages(trimmed);
    } catch {
      setError("Failed to send message. Please try again.");
    }
  }

  // Delete message
  async function handleDeleteMessage(id) {
    try {
      await deleteMessages(id);
      setUserMessages((prev) => prev.filter((m) => m.id !== id));
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
              const msgUser = (message.username || "").trim().toLowerCase();
              const myUser = (loggedInUsername || "").trim().toLowerCase();
              const isUserMsg = msgUser && msgUser === myUser;
              return (
                <div
                  key={message.id}
                  className={
                    isUserMsg
                      ? "user-message message-bubble"
                      : "other-message message-bubble"
                  }
                >
                  <p>{sanitize(message.text)}</p>
                  <span className="timestamp">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                  {isUserMsg && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      ×
                    </button>
                  )}
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
        {error && (
          <p className="error" style={{ marginTop: 8, textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>

      <SideNav />
    </div>
  );
}

export default Chat;
