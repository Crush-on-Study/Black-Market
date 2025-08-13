import React from 'react';

const ChatChannels = ({ activeChannel, onChannelChange }) => {
  const channels = [
    { id: 'general', name: '일반', icon: '💬', unread: 0 },
    { id: 'trade', name: '거래문의', icon: '💰', unread: 2 },
    { id: 'notice', name: '공지사항', icon: '📢', unread: 1 },
    { id: 'random', name: '잡담', icon: '🎭', unread: 0 }
  ];
  
  return (
    <div className="chat-channels">
      <div className="channels-header">
        <span>채널</span>
      </div>
      
      <div className="channels-list">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`channel-item ${activeChannel === channel.id ? 'active' : ''}`}
            onClick={() => onChannelChange(channel.id)}
          >
            <span className="channel-icon">{channel.icon}</span>
            <span className="channel-name">{channel.name}</span>
            {channel.unread > 0 && (
              <span className="unread-count">{channel.unread}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatChannels;
