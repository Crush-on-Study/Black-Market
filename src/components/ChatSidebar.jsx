import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import UserList from './UserList';
import '../styles/components/ChatSidebar.css';

const ChatSidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };
  
  // 모바일에서는 기본적으로 최소화
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMinimized(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (isMinimized) {
    return (
      <div className="chat-sidebar minimized">
        <div className="minimized-header" onClick={toggleMinimized}>
          <span className="chat-icon">💬</span>
          <span className="notification-badge">3</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="chat-sidebar">
      <ChatHeader onMinimize={toggleMinimized} />
      
      <div className="chat-main">
        <ChatMessages />
        <ChatInput />
      </div>
      
      <UserList />
    </div>
  );
};

export default ChatSidebar;
