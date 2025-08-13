import React from 'react';

const UserList = () => {
  // 임시 사용자 데이터
  const onlineUsers = [
    { id: 1, name: '거래왕김철수', status: 'online' },
    { id: 2, name: '포인트마스터', status: 'online' },
    { id: 3, name: '시스템관리자', status: 'online' },
    { id: 4, name: '거래초보', status: 'away' },
    { id: 5, name: '포인트수집가', status: 'offline' }
  ];
  
  const onlineCount = onlineUsers.filter(user => user.status === 'online').length;
  
  return (
    <div className="user-list">
      <div className="users-header">
        <span>온라인</span>
        <span className="online-count">{onlineCount}명</span>
      </div>
    </div>
  );
};

export default UserList;
