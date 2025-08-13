import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  // 상태
  messages: {},
  channels: [
    { id: 'general', name: '일반', icon: '💬', unread: 0 },
    { id: 'trade', name: '거래문의', icon: '💰', unread: 2 },
    { id: 'notice', name: '공지사항', icon: '📢', unread: 1 },
    { id: 'random', name: '잡담', icon: '🎭', unread: 0 }
  ],
  activeChannel: 'general',
  onlineUsers: [
    { id: 1, name: '거래왕김철수', avatar: '👤', status: 'online', isTyping: false },
    { id: 2, name: '포인트마스터', avatar: '👤', status: 'online', isTyping: true },
    { id: 3, name: '시스템관리자', avatar: '🤖', status: 'online', isTyping: false },
    { id: 4, name: '거래초보', avatar: '👤', status: 'away', isTyping: false },
    { id: 5, name: '포인트수집가', avatar: '👤', status: 'offline', isTyping: false }
  ],
  isTyping: {},
  
  // 액션
  setActiveChannel: (channelId) => {
    set({ activeChannel: channelId });
    
    // 채널 변경 시 해당 채널의 읽지 않은 메시지 수 초기화
    set((state) => ({
      channels: state.channels.map(channel => 
        channel.id === channelId 
          ? { ...channel, unread: 0 }
          : channel
      )
    }));
  },
  
  addMessage: (channelId, message) => {
    const newMessage = {
      id: Date.now(),
      ...message,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [
          ...(state.messages[channelId] || []),
          newMessage
        ]
      }
    }));
    
    // 현재 활성 채널이 아닌 경우 읽지 않은 메시지 수 증가
    if (channelId !== get().activeChannel) {
      set((state) => ({
        channels: state.channels.map(channel => 
          channel.id === channelId 
            ? { ...channel, unread: (channel.unread || 0) + 1 }
            : channel
        )
      }));
    }
  },
  
  setTypingStatus: (userId, channelId, isTyping) => {
    set((state) => ({
      isTyping: {
        ...state.isTyping,
        [`${channelId}-${userId}`]: isTyping
      }
    }));
  },
  
  updateUserStatus: (userId, status) => {
    set((state) => ({
      onlineUsers: state.onlineUsers.map(user => 
        user.id === userId 
          ? { ...user, status }
          : user
      )
    }));
  },
  
  // 계산된 값들
  getChannelMessages: (channelId) => {
    const state = get();
    return state.messages[channelId] || [];
  },
  
  getUnreadCount: (channelId) => {
    const state = get();
    const channel = state.channels.find(c => c.id === channelId);
    return channel ? channel.unread : 0;
  },
  
  getTotalUnreadCount: () => {
    const state = get();
    return state.channels.reduce((total, channel) => total + channel.unread, 0);
  },
  
  // 초기화
  resetChat: () => {
    set({
      messages: {},
      activeChannel: 'general',
      isTyping: {}
    });
  }
}));
