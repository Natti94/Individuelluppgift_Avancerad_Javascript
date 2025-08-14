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
      fetchMessages();
    } catch (err) {
      setError("Failed to send message. Please try again later.", err);
    }
    setSuccess(false);
  }

  async function fetchMessages() {
    try {
      const messages = await getUserMessages();
      setUserMessage(messages);
      setSuccess(true);
    } catch (err) {
      setError("Failed to fetch messages. Please try again later.", err);
    }
  }
  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchAllMessages() {
    try {
      const messages = await getAllMessages();
      setAllConversations(messages);
      setSuccess(true);
    } catch (err) {
      setError("Failed to fetch conversations. Please try again later.", err);
    }
  }
  useEffect(() => {
    fetchAllMessages();
  }, []);

  return (
    <div className="chat-container">
      <h1>Chat</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Messages fetched successfully!</p>}
      <div>
        <hr />
        <h4>Your Message:</h4>
        <form onSubmit={handleSendMessage}>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div>
        <h2>Your Conversations:</h2>
        <h2>All Conversations</h2>
        <ul>
          {allConversations &&
            allConversations.length > 0 &&
            allConversations.map((conversation, index) => (
              <li key={index}>{conversation}</li>
            ))}

          <button onClick={fetchAllConversations}>Get Conversations</button>
        </ul>
        <div>
          {allConversations && allConversations.length === 0 && (
            <p>No conversations found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Chat;
