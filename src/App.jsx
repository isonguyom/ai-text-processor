import { useState, useEffect } from "react";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";

// Language Detector API
const languageDetector = (() => {

  if ('ai' in self && 'languageDetector' in self.ai) {
    let detector;

    const initialize = async () => {
      // The Language Detector API is available.

      if (!detector) {
        const capabilities = await self.ai.languageDetector.capabilities();
        const canDetect = capabilities.capabilities;

        if (canDetect === "readily") {
          detector = await self.ai.languageDetector.create();
          console.log("Language detector is ready.");
        } else {
          // The language detector can be used after model download.
          detector = await self.ai.languageDetector.create({
            monitor(m) {
              m.addEventListener('downloadprogress', (e) => {
                console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
              });
            },
          });
          await detector.ready;
        }

      }

      return detector;

    };

    const detect = async (text) => {
      try {
        const instance = await initialize();
        if (!instance) return "Unknown";

        const results = await instance.detect(text);
        if (results.length > 0) {
          const { detectedLanguage } = results[0];
          return detectedLanguage;
        }
        return "Unknown";
      } catch (error) {
        console.error("Language detection failed:", error);
        return "Unknown";
      }
    };

    return { detect };
  } else {
    alert("Language Detector API is not available.")
    return { detect: () => "Unknown" };
  }
})();

const App = () => {
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [detectLoadingIndex, setDetectLoadingIndex] = useState(null);
  const [translateLoadingIndex, setTranslateLoadingIndex] = useState(null);
  const [summaryLoadingIndex, setSummaryLoadingIndex] = useState(null);

  // Handle text detection
  const handleSend = async (text) => {
    try {
      setDetectLoadingIndex(text);
      const language = await languageDetector.detect(text);
      setMessages([...messages, { text, language, selectedLanguage: "en" }]);
    } catch {
      alert("Translator cannot translate between this languages");
    } finally {
      setDetectLoadingIndex(null);
    }
  };

  // Handle translation
  const handleTranslate = async (index) => {
    if ('ai' in self && 'translator' in self.ai) {
      // The Translator API is supported.

      try {
        setTranslateLoadingIndex(index);
        const text = messages[index].text;
        const sourceLanguage = messages[index].language;
        const targetLanguage = messages[index].selectedLanguage;

        const translator = await self.ai.translator.create({
          sourceLanguage,
          targetLanguage,
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });

        const res = await translator.translate(text);
        const updatedMessages = [...messages];
        updatedMessages[index].translation = res;
        setMessages(updatedMessages);
      } catch {
        alert("Translator cannot translate between this languages");
      } finally {
        setTranslateLoadingIndex(null);
      }
    } else {
      alert("Translator API is not available.")
    }
  };

  // Handle language change
  const handleLanguageChange = (index, value) => {
    const updatedMessages = [...messages];
    updatedMessages[index].selectedLanguage = value;
    setMessages(updatedMessages);
  };


  // Handle text summarization
  const summarizeText = async (index) => {
    if ('ai' in self && 'summarizer' in self.ai) {
      // The Summarizer API is supported.

      try {
        setSummaryLoadingIndex(index);
        const available = (await self.ai.summarizer.capabilities()).available;
        const text = messages[index].text;
        const options = {
          sharedContext: text,
          type: 'key-points',
          format: 'markdown',
          length: 'medium',
        };

        if (available === 'no') {
          // The Summarizer API isn't usable.

          alert("Summarizer API is not usable.");
          return;
        }
        if (available === 'readily') {
          // The Summarizer API can be used immediately .
          const summarizer = await ai.summarizer.create({
            options,
            monitor(m) {
              m.addEventListener('downloadprogress', (e) => {
                console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
              });
            }
          });

          const summary = await summarizer.summarize();
          const updatedMessages = [...messages];
          updatedMessages[index].summary = summary;
          setMessages(updatedMessages);
        } else {

          await summarizer.ready;
        }

      } catch {
        alert("Error summarizing text");
      } finally {
        setSummaryLoadingIndex(null);
      }
    } else {
      alert("Summarizer API is not available.")
    }
  }

  useEffect(() => {
    languageDetector.detect("test");
  }, []);

  return (
    <div className={`app w-full h-screen overflow-hidden m-0 flex flex-col gap-4 px-4 md:px-6 py-6 ${darkMode ? "dark bg-gray-700 text-white" : "light bg-white text-gray-800"}`}>

      {/* Top Nav */}
      <nav className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="text-xl md:text">&#9997;</div>
          <div>
            <h1 className="font-bold md:text-xl text-green-600 uppercase">AI-Text</h1>
            <p className="-mt-2 font-light">Processor</p>
          </div></div>
        <button onClick={() => setDarkMode(!darkMode)} className="w-[32px] mode-btn h-[32px] rounded-full flex items-center justify-center cursor-pointer transition duration-200 ease-in-out">
          {darkMode ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M12 19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1m6.364-2.05l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.414m-12.728 0a1 1 0 0 1 1.497 1.32l-.083.094l-.707.707a1 1 0 0 1-1.497-1.32l.083-.094zM12 6a6 6 0 1 1 0 12a6 6 0 0 1 0-12m-8 5a1 1 0 0 1 .117 1.993L4 13H3a1 1 0 0 1-.117-1.993L3 11zm17 0a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2zM4.929 4.929a1 1 0 0 1 1.32-.083l.094.083l.707.707a1 1 0 0 1-1.32 1.497l-.094-.083l-.707-.707a1 1 0 0 1 0-1.414m14.142 0a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1" /></g></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11.807A9 9 0 0 1 10.049 2a9.94 9.94 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142c3.906 3.906 10.237 3.905 14.143 0a9.95 9.95 0 0 0 2.735-5.119A9 9 0 0 1 12 11.807" /></svg>}
        </button>
      </nav>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-hidden flex flex-col gap-2 w-full max-w-2xl mx-auto">
        <div className="w-full border border-custom rounded-md p-3 flex-1 flex flex-col gap-y-3 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="bg-custom flex flex-col gap-y-2 rounded p-3">
              {detectLoadingIndex === msg.text ? <div>Detecting...</div> : <> <ChatMessage message={msg} />
                <div className="w-fit flex flex-col gap-y-2">
                  <form onSubmit={(e) => { e.preventDefault(); handleTranslate(index); }} className="flex items-center gap-x-2">
                    <label htmlFor={`language-select-${index}`} className="sr-only">
                      Select language
                    </label>
                    <select
                      id={`language-select-${index}`}
                      value={msg.selectedLanguage}
                      onChange={(e) => handleLanguageChange(index, e.target.value)}
                      className={`border rounded p-1 px-2 text-xs outline-offset-2 transition duration-200 ease-in-out ${translateLoadingIndex === index ? "opacity-50 outline-none cursor-not-allowed" : "hover:border-green-800 cursor-pointer"}`}
                    >
                      <option value="en">English (en)</option>
                      <option value="pt">Portuguese (pt)</option>
                      <option value="es">Spanish (es)</option>
                      <option value="ru">Russian (ru)</option>
                      <option value="tr">Turkish (tr)</option>
                      <option value="fr">French (fr)</option>
                    </select>
                    <button
                      type="submit" aria-label={translateLoadingIndex === index ? "Translating Text" : "Translate Text"}
                      className={`border rounded p-1 px-2 bg-green-600 text-xs text-white font-medium transition duration-200 ease-in-out ${translateLoadingIndex === index ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-green-800"}`}
                      disabled={translateLoadingIndex === index}
                      aria-live="polite"
                    >
                      {translateLoadingIndex === index ? "Translating..." : "Translate"}
                    </button>
                  </form>
                  {msg.text.length > 150 && msg.language === "en" && (
                    <button onClick={() => summarizeText(index)} disabled={summaryLoadingIndex === index} aria-label={summaryLoadingIndex === index ? "Summarizing Text" : "Summarize Text"}
                      className={`border border-green-600 rounded p-1 px-2 text-green-600 text-xs font-medium transition duration-200 ease-in-out ${summaryLoadingIndex === index ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-green-800 hover:text-white hover:border-green-800"}`}>
                      {summaryLoadingIndex === index ? "Summarizing" : "Summarize"} </button>
                  )}
                </div></>}

            </div>
          ))}
        </div>
        <div className="w-full">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default App;
