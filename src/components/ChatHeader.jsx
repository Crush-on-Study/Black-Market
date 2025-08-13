import React from 'react';

const ChatHeader = ({ onMinimize, onToggleExpanded, isExpanded }) => {
  return (
    <div className="chat-header">
      <div className="chat-title">
        <span className="chat-icon">💬</span>
        <span className="channel-name">Black Market Chat</span>
      </div>
      
      <div className="chat-controls">
        <button 
          className="control-btn expand-btn"
          onClick={onToggleExpanded}
          title={isExpanded ? "축소" : "확장"}
        >
          {isExpanded ? "▼" : "▲"}
        </button>
        <button 
          className="control-btn minimize-btn"
          onClick={onMinimize}
          title="최소화"
        >
          ➖
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
