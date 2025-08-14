import { useState, useEffect } from "react";
import { postMessages, getUserMessages, getAllMessages } from "../../services";

function Chat() {
  const [userMessage, setUserMessage] = useState("");
  const [allConversations, setAllConversations] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSendMessage(e) {
    e.preventDefault();
    try {
      await postMessages(userMessage);
      setUserMessage("");
      setSuccess(true);
    } catch (err) {
      setError("Failed to send message. Please try again.", err);
    }
    setSuccess(false);
  }

  async function handleGetMessages(e) {
    e.preventDefault();
    try {
      await getUserMessages(userMessage);
      setUserMessage("");
      setSuccess(true);
    } catch (err) {
      setError("Failed to fetch messages. Please try again.", err);
    }
    setSuccess(false);
  }

  return (
    <div>
      <div className="chat-container">
        <h1>Chat</h1>
        <hr />
        <h4>Send a message:</h4>
        <form onSubmit={handleSendMessage}>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button type="submit">Send</button>
        </form>
        {success && <p className="success">Messages fetched successfully!</p>}
        {error && <p className="error">{error}</p>}
      </div>
      <div className="user-messages-container">
        <h2>Your Messages</h2>
        <button onClick={handleGetMessages}>Get Messages</button>
        <div className="messages-list">
          {allConversations.map((message, index) => (
            <div key={index} className="message-item">
              <p>{message.text}</p>
              <span>{new Date(message.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Chat;
