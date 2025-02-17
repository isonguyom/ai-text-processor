import { useState } from "react";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import LanguageSelector from "../components/LanguageSelector";
import ActionButtons from "../components/ActionButtons";

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [darkMode, setDarkMode] = useState(false);

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
        <div className={`w-full h-full min-h-screen p-4 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}>
            <nav className="flex justify-between items-center w-full gap-x-4">
                <h1 className="text-2xl font-bold">AI Text Processor</h1>
                <div className="flex justify-between items-center w-fit gap-x-4">
                    <button onClick={() => setDarkMode(!darkMode)} className="w-fit p-2 cursor-pointer border rounded">
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                    <LanguageSelector onSelect={setSelectedLanguage} />
                </div>
            </nav>
            <div className="max-w-3xl mx-auto flex flex-col gap-y-4 h-full">

                <div className="w-full h-[400px] overflow-y-auto border rounded-md p-4 flex flex-col gap-y-3">
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
                <ChatInput onSend={handleSend} />
            </div>
        </div>
    );
};

export default Home;
