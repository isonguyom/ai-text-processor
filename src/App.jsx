import { useState } from "react";
import axios from "axios";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import LanguageSelector from "./components/LanguageSelector";
import ActionButtons from "./components/ActionButtons";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const API_BASE = "https://example-api.com"; // Replace with Chrome AI API

  const detectLanguage = async (text) => {
    try {
      const res = await axios.post(`${API_BASE}/detect-language`, { text });
      return res.data.language;
    } catch {
      return "Unknown";
    }
  };

  const summarizeText = async (index) => {
    const text = messages[index].text;
    try {
      const res = await axios.post(`${API_BASE}/summarize`, { text });
      const updatedMessages = [...messages];
      updatedMessages[index].summary = res.data.summary;
      setMessages(updatedMessages);
    } catch {
      alert("Error summarizing text");
    }
  };

  const translateText = async (index) => {
    const text = messages[index].text;
    try {
      const res = await axios.post(`${API_BASE}/translate`, { text, to: selectedLanguage });
      const updatedMessages = [...messages];
      updatedMessages[index].translation = res.data.translation;
      setMessages(updatedMessages);
    } catch {
      alert("Error translating text");
    }
  };

  const handleSend = async (text) => {
    const language = await detectLanguage(text);
    setMessages([{ text, language }, ...messages]);
  };

  return (
    <div className="app">
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index}>
            <ChatMessage message={msg} />
            {msg.text.length > 150 && msg.language === "en" && (
              <ActionButtons
                onSummarize={() => summarizeText(index)}
                onTranslate={() => translateText(index)}
              />
            )}
          </div>
        ))}
      </div>
      <LanguageSelector onSelect={setSelectedLanguage} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default App;
