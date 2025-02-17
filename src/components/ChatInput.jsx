import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="chat-input">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
