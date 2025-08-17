import { useState } from "react";
import { postMessages, getUserMessages } from "../../Services";
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
      setTimeout(() => setSuccessSendMessage(false), 2000);
    } catch {
      setErrorSendMessage("Failed to send message. Please try again.");
      setSuccessSendMessage(false);
      setTimeout(() => setErrorSendMessage(null), 2000);
    }
  }

  async function handleGetMessages(e) {
    e.preventDefault();
    try {
      await getUserMessages(userMessages);
      setUserMessages([]);
      setSuccessGetMessages(true);
      setErrorGetMessages(null);
      setTimeout(() => setSuccessGetMessages(false), 2000);
    } catch {
      setErrorGetMessages("Failed to fetch messages. Please try again.");
      setSuccessGetMessages(false);
      setTimeout(() => setErrorGetMessages(null), 2000);
    }
  }

  return (
    <div className="chat-page-root">
      <div className="chat-container">
        <h1>Chat</h1>
        <h4>Send a message:</h4>
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
        <hr />
        <div style={{ marginTop: 32 }}>
          <h4>Message history</h4>
          <button onClick={handleGetMessages}>Show</button>
          <div className="messages-list">
            {userMessages.map((message, index) => (
              <div key={index} className="message-item user-message-item">
                <p>{message.text}</p>
                <span>{new Date(message.createdAt).toLocaleString()}</span>
              </div>
            ))}
            {successGetMessages && (
              <p className="success">Messages fetched successfully!</p>
            )}
            {errorGetMessages && <p className="error">{errorGetMessages}</p>}
          </div>
        </div>
      </div>
        <SideNav />
    </div>
  );
}
export default Chat;
