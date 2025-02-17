const ActionButtons = ({ onSummarize, onTranslate }) => {
    return (
      <div className="actions">
        <button onClick={onSummarize}>Summarize</button>
        <button onClick={onTranslate}>Translate</button>
      </div>
    );
  };
  
  export default ActionButtons;
  