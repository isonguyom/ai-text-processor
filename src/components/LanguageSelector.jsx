const LanguageSelector = ({ onSelect }) => {
    const languages = [
      { code: "en", name: "English" },
      { code: "pt", name: "Portuguese" },
      { code: "es", name: "Spanish" },
      { code: "ru", name: "Russian" },
      { code: "tr", name: "Turkish" },
      { code: "fr", name: "French" },
    ];
  
    return (
      <select onChange={(e) => onSelect(e.target.value)} className="w-fit p-2 cursor-pointer border rounded">
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>
    );
  };
  
  export default LanguageSelector;
  