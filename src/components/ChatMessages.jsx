import React, { useRef, useEffect } from 'react';

const ChatMessages = ({ currentUserNickname = '사용자' }) => {
  const messagesEndRef = useRef(null);
  
  // 메시지 데이터 (임시) - 시스템 메시지를 상단에 배치
  const messages = [
    // 시스템 메시지를 상단에 고정
    {
      id: 'system-warning',
      type: 'system',
      message: '📢 폭언, 음란, 불법 행위, 상업적 홍보 등 채팅방 사용을 저해하는 활동에 대해 메세지 삭제 및 계정 정지 조치를 할 수 있습니다.',
      timestamp: null
    },
    // 일반 사용자 메시지들
    {
      id: 1,
      user: '보통 일주일인거 같은데',
      message: '안녕하세요! 오늘도 좋은 거래 되시길 바랍니다.',
      timestamp: '10:00',
      type: 'user'
    },
    {
      id: 2,
      user: '감격스러운 개리',
      message: '포인트 거래 문의 있으시면 언제든 말씀해주세요!',
      timestamp: '17:19',
      type: 'user'
    },
    {
      id: 3,
      user: currentUserNickname, // 현재 사용자 메시지
      message: '네, 감사합니다!',
      timestamp: '11:18',
      type: 'user'
    },
    {
      id: 4,
      user: '은혜로운 점넙치',
      message: '오늘 날씨가 정말 좋네요.',
      timestamp: '13:33',
      type: 'user'
    },
    {
      id: 5,
      user: '마땅한 어포섬',
      message: '거래 성사 축하드립니다!',
      timestamp: '16:15',
      type: 'user'
    },
    {
      id: 6,
      user: currentUserNickname, // 현재 사용자 메시지
      message: '다음에도 좋은 거래 기대하겠습니다.',
      timestamp: '19:11',
      type: 'user'
    },
    {
      id: 7,
      user: '황혼의 포도상추',
      message: '정말 유용한 정보였어요.',
      timestamp: '19:47',
      type: 'user'
    }
  ];
  
  // 새 메시지가 올 때마다 스크롤을 맨 아래로 (시스템 메시지 제외)
  useEffect(() => {
    const userMessages = messages.filter(msg => msg.type === 'user');
    if (userMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // 시스템 메시지와 사용자 메시지 분리
  const systemMessages = messages.filter(msg => msg.type === 'system');
  const userMessages = messages.filter(msg => msg.type === 'user');
  
  // 메시지가 내 메시지인지 상대방 메시지인지 판단
  const isMyMessage = (messageUser) => {
    return messageUser === currentUserNickname;
  };
  
  return (
    <div className="chat-messages">
      <div className="messages-container">
        {/* 시스템 메시지를 상단에 고정 */}
        {systemMessages.map((msg) => (
          <div key={msg.id} className="message system-message">
            <div>
              {msg.message}
            </div>
          </div>
        ))}
        
        {/* 사용자 메시지들 */}
        {userMessages.map((msg) => {
          const isMyMsg = isMyMessage(msg.user);
          return (
            <div 
              key={msg.id} 
              className={`message user-message ${isMyMsg ? 'my-message' : 'other-message'}`}
            >
              <div className="message-header">
                <span className="user-name">{msg.user}</span>
                <span className="message-time">{msg.timestamp}</span>
              </div>
              <div className="message-content">
                {msg.message}
              </div>
              <div className="message-actions">
                <button className="like-button">👍</button>
              </div>
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
