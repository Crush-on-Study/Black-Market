import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import '../styles/components/Header.css';

function Header({ 
  companyName, 
  userNickname, 
  userEmail, 
  userAvatar, 
  onAvatarChange,
  onSellRegister,
  onBuyRegister 
}) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleProfileAction = (action) => {
    setIsProfileDropdownOpen(false);
    switch (action) {
      case 'edit-photo':
        document.getElementById('avatar-upload').click();
        break;
      case 'trade-requests':
        // 거래 요청 제안 확인 기능 (향후 구현)
        // TODO: 거래 요청 제안 확인 기능 구현
        break;
      case 'change-password':
        // 비밀번호 변경 기능 (향후 구현)
        // TODO: 비밀번호 변경 기능 구현
        break;
      default:
        break;
    }
  };

  return (
    <header className="main-header">
      <div className="header-content">
                <div className="company-info">
          <h1>⚡ {companyName} Black Market ⚡</h1>
        </div>
        
        <div className="right-section">
          <div className="header-buttons">
            <Button variant="primary" size="medium" onClick={onSellRegister}>
              🔴 판매등록
            </Button>
            <Button variant="secondary" size="medium" onClick={onBuyRegister}>
              🟢 구매등록
            </Button>
          </div>
          
          <div className="user-profile" ref={dropdownRef}>
            <div className="avatar-container">
              <img 
                src={userAvatar || '/default-avatar.svg'} 
                alt="프로필" 
                className="user-avatar"
                onClick={handleProfileClick}
              />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      onAvatarChange(e.target.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <div className="user-info">
              <span className="user-nickname">{userNickname}</span>
              <span className="user-email">{userEmail}</span>
            </div>
            
            {/* 프로필 드롭다운 메뉴 */}
            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={() => handleProfileAction('edit-photo')}>
                  📷 사진 수정
                </div>
                <div className="dropdown-item" onClick={() => handleProfileAction('trade-requests')}>
                  📋 거래 요청 제안 확인
                </div>
                <div className="dropdown-item" onClick={() => handleProfileAction('change-password')}>
                  🔒 비밀번호 변경
                </div>
              </div>
            )}
          </div>
          
          <Button variant="outline" size="medium" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
