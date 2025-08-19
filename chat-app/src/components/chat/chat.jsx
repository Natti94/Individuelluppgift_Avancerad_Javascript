import { useState, useEffect } from "react";
import { postMessages, getUserMessages, deleteMessages } from "../../Services";
import SideNav from "../sideNav/sideNav";

function Chat() {
  const [sendMessage, setSendMessage] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [errorSendMessage, setErrorSendMessage] = useState(null);
  const [successSendMessage, setSuccessSendMessage] = useState(false);
  const [errorGetMessages, setErrorGetMessages] = useState(null);
  const [successGetMessages, setSuccessGetMessages] = useState(false);

  async function handleSendMessage(e) {
    e.preventDefault();
    try {
      await postMessages(sendMessage);
      setSendMessage("");
      setSuccessSendMessage(true);
      setErrorSendMessage(null);
      // Refresh messages after sending
      await fetchMessages();
    } catch {
      setErrorSendMessage("Failed to send message. Please try again.");
      setSuccessSendMessage(false);
    }
  }

  async function fetchMessages() {
    try {
      const messages = await getUserMessages();
      setUserMessages(messages || []);
      setSuccessGetMessages(true);
      setErrorGetMessages(null);
    } catch {
      setErrorGetMessages("Failed to fetch messages. Please try again.");
      setSuccessGetMessages(false);
    }
  }

  async function handleGetMessages(e) {
    e.preventDefault();
    await fetchMessages();
  }

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDeleteMessages(e) {
    e.preventDefault();
    try {
      await deleteMessages(messageId);
      setUserMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
      setSuccessGetMessages(true);
      setErrorGetMessages(null);
    } catch {
      setErrorGetMessages("Failed to delete message. Please try again.");
      setSuccessGetMessages(false);
    }
  }

  return (
    <div className="chat-page-root">
      <div className="chat-container">
        <h1>Chat</h1>
        <p>Send a message:</p>
        <form onSubmit={handleSendMessage}>
          <textarea
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button type="submit">Send</button>
          {successSendMessage && (
            <p className="success">Message sent successfully!</p>
          )}
          {errorSendMessage && <p className="error">{errorSendMessage}</p>}
        </form>
      </div>
      <div className="user-messages-container">
        <h1>Messages</h1>
        <button onClick={handleGetMessages}>Show</button>
        <br />
        {successGetMessages && (
          <p className="success">Messages fetched successfully!</p>
        )}
        {errorGetMessages && <p className="error">{errorGetMessages}</p>}
        <ul className="messages-list">
          {(userMessages || []).map((message, index) => (
            <div
              key={index}
              className={message.isUser ? "user-message" : "other-message"}
            >
              <p>{message.text}</p>
              <span>{new Date(message.createdAt).toLocaleString()}</span>
              <br />
              <button onClick={handleDeleteMessages}>Delete</button>
              <hr />
            </div>
          ))}
        </ul>
      </div>

      <SideNav />
    </div>
  );
}

export default Chat;
