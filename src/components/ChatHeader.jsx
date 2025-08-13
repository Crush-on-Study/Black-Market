import React from 'react';

const ChatHeader = ({ onMinimize }) => {
  return (
    <div className="chat-header">
      <div className="chat-title">
        <span className="chat-icon">💬</span>
        <span className="channel-name">채팅</span>
      </div>
      
      <div className="chat-controls">
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
