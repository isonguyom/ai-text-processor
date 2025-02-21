const ChatMessage = ({ message }) => {
  const getLanguageName = (code) => {
    const languageMap = {
      en: "English",
      fr: "French",
      de: "German",
      es: "Spanish",
      it: "Italian",
      pt: "Portuguese",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
      ru: "Russian",
      ar: "Arabic",
      hi: "Hindi",
      nl: "Dutch",
      sv: "Swedish",
      no: "Norwegian",
      da: "Danish",
      fi: "Finnish",
      pl: "Polish",
      tr: "Turkish",
      cs: "Czech",
      hu: "Hungarian",
      ro: "Romanian",
      el: "Greek",
      th: "Thai",
      id: "Indonesian",
      vi: "Vietnamese",
      he: "Hebrew",
      uk: "Ukrainian",
    };
    return languageMap[code] || "Unknown";
  };

  const languageName = getLanguageName(message.language);


  const langFormat = (`${languageName} (${message.language})`);

  return (
    <div className="w-full flex flex-col gap-y-2 rounded">
      <p>{message.text}</p>
      <div className="flex flex-col gap-y-1 border-t border-custom pt-2 text-sm italic opacity-75">
        {message.language && <p><strong>Text Language:</strong> {langFormat}</p>}
        {message.summary && <p><strong>Summary:</strong> {message.summary}</p>}
        {message.translation && <p><strong>Translation:</strong> {message.translation}</p>}
      </div>
    </div>
  );
};

export default ChatMessage;
