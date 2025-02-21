import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text); // Emit the input text to the parent component
      setText(""); // Clear the textarea after sending
    }
  };

  return (
    <div className="w-full h-fit">
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-x-2 w-full items-center justify-between h-fit">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text..."
          className="flex-grow p-2 border border-custom overflow-y-auto hover:border-green-800 outline-offset-3 rounded h-12 transition duration-200 ease-in-out"
          aria-label="Enter text"
          style={{ resize: "none" }}
        />
        <button type="submit"
          className="w-fit h-12 px-4 py-2 flex items-center justify-center cursor-pointer bg-green-600 text-white font-medium rounded outline-offset-2 hover:bg-green-800 transition duration-200 ease-in-out"
          aria-label="Send text"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
