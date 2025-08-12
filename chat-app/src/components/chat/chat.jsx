import { useState, useEffect } from "react";
import { getMessages } from "../../services";

function Chat() {
  const [userMessage, setUserMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  async function fetchMessages() {
    try {
      const messages = await getMessages();
      setAllMessages(messages);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h1>Chat</h1>
      {error && <p>Error: {error}</p>}
      {success && <p>Message sent successfully!</p>}
      <div>
        {allMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
}
