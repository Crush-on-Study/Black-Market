import React, { useState } from 'react';

const ChatInput = ({ userNickname = '사용자' }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // TODO: 메시지 전송 로직 구현
      console.log('메시지 전송:', message);
      setMessage('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };
  
  return (
    <div className="chat-input">
      <form onSubmit={handleSubmit}>
        <div className="input-label">
          <span>{userNickname}</span>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`${userNickname}(으)로 대화해 보세요`}
            className="message-input"
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!message.trim()}
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
