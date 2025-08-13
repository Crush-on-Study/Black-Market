import React, { useState, useEffect, useMemo } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import UserList from './UserList';
import '../styles/components/ChatBar.css';

const ChatBar = ({ userNickname = '사용자' }) => {
  // localStorage에서 최소화 상태 복원
  const getInitialMinimizedState = () => {
    try {
      const stored = localStorage.getItem('chatBarMinimized');
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.warn('채팅바 상태 복원 실패:', error);
      return false;
    }
  };

  const [isMinimized, setIsMinimized] = useState(getInitialMinimizedState);
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // 읽지 않은 메시지 카운트
  
  // 최소화 상태 변경 시 localStorage에 저장
  const toggleMinimized = useMemo(() => () => {
    setIsMinimized(prev => {
      const newState = !prev;
      try {
        localStorage.setItem('chatBarMinimized', JSON.stringify(newState));
      } catch (error) {
        console.warn('채팅바 상태 저장 실패:', error);
      }
      return newState;
    });
  }, []);
  
  // 확장/축소 토글
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    // 확장 시 읽지 않은 메시지 카운트 초기화
    if (!isExpanded) {
      setUnreadCount(0);
    }
  };
  
  // 모바일에서는 기본적으로 최소화
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        const newState = true;
        setIsMinimized(newState);
        try {
          localStorage.setItem('chatBarMinimized', JSON.stringify(newState));
        } catch (error) {
          console.warn('모바일 채팅바 상태 저장 실패:', error);
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (isMinimized) {
    return (
      <div className="chat-bar minimized">
        <div className="minimized-header" onClick={toggleMinimized}>
          <span className="chat-icon">💬</span>
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="chat-bar">
      <ChatHeader 
        onMinimize={toggleMinimized} 
        onToggleExpanded={toggleExpanded}
        isExpanded={isExpanded}
      />
      
      {isExpanded && (
        <div className="chat-main">
          <ChatMessages currentUserNickname={userNickname} />
          <ChatInput userNickname={userNickname} />
          <UserList />
        </div>
      )}
    </div>
  );
};

export default ChatBar;
