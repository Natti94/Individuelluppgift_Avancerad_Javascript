import { useState, useEffect } from "react";
import { postMessages, getUserMessages, deleteMessages } from "../../Services";
import { mockMessages } from "./Mocks/Mocks";
import SideNav from "../Nav/SideNav"
import DOMPurify from "dompurify";

// KONTROLLERAR TOKEN ANNARS RETURNAR NULL OM INGET SKICKAS
// KONVERTERAR TILL BASE64 & AVKODAR TILL EN VANLIG STRÄNG
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

  let loggedInUsername = "You";
  let loggedInAvatar =
    sessionStorage.getItem("avatar") || "https://i.pravatar.cc/40";

  const jwt = sessionStorage.getItem("jwtToken");
  const jwtPayload = parseJwt(jwt);
  const realUsername = (jwtPayload?.username || "").trim().toLowerCase();

  // VID LOADING/MOUNT FETCHAR ALLA MEDDELANDE MED jwtToken
  // HÄMTAR UT ALLA MEDDELANDEN
  // SE SERVICES.JS - getUserMessages
  useEffect(() => {
    async function fetchMessages() {
      try {
        let messages = await getUserMessages();
        messages = messages.map((msg) => {
          const msgUser = (msg.username || "").trim().toLowerCase();
          if (msgUser === realUsername) {
            return {
              ...msg,
              isUser: true,
              username: "You",
              avatar: loggedInAvatar,
            };
          } else {
            return {
              ...msg,
              isUser: false,
              username: "SupportBot",
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
  }, [loggedInUsername, loggedInAvatar, realUsername]);

  // UPPDATERAR MEDDELANDES ID EFTER ATT DET SPARATS I API:et
  // SKICKAR MEDDELANDE, LÄGGER TILL I LISTAN OCH HANTERAR API-SVAR
  async function handleSendMessage(e) {
    e.preventDefault();
    const trimmed = sendMessage.trim();
    if (!trimmed) return;

    try {
      const tempId = Date.now().toString();
      const newMsg = {
        id: tempId,
        text: trimmed,
        createdAt: new Date().toISOString(),
        isUser: true,
        username: "You",
        avatar: loggedInAvatar,
      };
      setUserMessages((prev) => [...prev, newMsg]);
      setSendMessage("");

      setError(null);
      const response = await postMessages(trimmed);
      const realId = response?.latestMessage?.id;
      if (realId) {
        setUserMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 && msg.id === tempId
              ? { ...msg, id: realId }
              : msg
          )
        );
      }

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
    } catch {
      setError("Failed to send message. Please try again.");
    }
  }

  // DELETAR MEDDELANDEN MED msgId
  // SE SERVICES.JS - deleteMessages
  async function handleDeleteMessage(msgId) {
    try {
      await deleteMessages(msgId);
      setUserMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch {
      setError("Failed to delete message.");
    }
  }

  // ESCAPAR ALLA HTML TAGS, BARA REN TEXT VISAS!
  function sanitize(str) {
    return DOMPurify.sanitize(str);
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
