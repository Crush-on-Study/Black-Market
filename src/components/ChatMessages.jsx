import React, { useRef, useEffect } from 'react';

const ChatMessages = () => {
  const messagesEndRef = useRef(null);
  
  // 메시지 데이터 (임시)
  const messages = [
    {
      id: 1,
      user: '거래왕김철수',
      avatar: '👤',
      message: '안녕하세요! 오늘도 좋은 거래 되시길 바랍니다.',
      timestamp: '10:30',
      type: 'user'
    },
    {
      id: 2,
      user: '시스템',
      avatar: '🤖',
      message: '새로운 거래가 등록되었습니다.',
      timestamp: '10:32',
      type: 'system'
    },
    {
      id: 3,
      user: '포인트마스터',
      avatar: '👤',
      message: '포인트 거래 문의 있으시면 언제든 말씀해주세요!',
      timestamp: '10:35',
      type: 'user'
    },
    {
      id: 4,
      user: '거래왕김철수',
      avatar: '👤',
      message: '네, 감사합니다!',
      timestamp: '10:36',
      type: 'user'
    }
  ];
  
  // 새 메시지가 올 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const getMessageClass = (type) => {
    switch (type) {
      case 'system':
        return 'message system-message';
      case 'user':
        return 'message user-message';
      default:
        return 'message';
    }
  };
  
  return (
    <div className="chat-messages">
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={getMessageClass(msg.type)}>
            <div className="message-header">
              <span className="user-avatar">{msg.avatar}</span>
              <span className="user-name">{msg.user}</span>
              <span className="message-time">{msg.timestamp}</span>
            </div>
            <div className="message-content">
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
