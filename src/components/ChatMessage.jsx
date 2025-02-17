const ChatMessage = ({ message }) => {
    return (
      <div className="chat-message">
        <p>{message.text}</p>
        {message.language && <small>Detected: {message.language}</small>}
        {message.summary && <p><strong>Summary:</strong> {message.summary}</p>}
        {message.translation && <p><strong>Translated:</strong> {message.translation}</p>}
      </div>
    );
  };
  
  export default ChatMessage;
  