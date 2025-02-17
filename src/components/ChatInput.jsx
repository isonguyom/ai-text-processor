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
    <div className="flex gap-x-2 w-full items-center justify-between">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text..."
        className="flex-grow-1 p-2 border rounded"
      />
      <button onClick={handleSend} className="w-fit px-4 py-3 cursor-pointer border rounded">Send</button>
    </div>
  );
};

export default ChatInput;
