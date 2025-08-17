import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import '../styles/components/Header.css';

const Header = ({ 
  companyName, 
  userNickname, 
  userEmail, 
  userAvatar, 
  onAvatarChange, 
  onSellRegister, 
  onBuyRegister,
  showBackButton = false,
  onBackClick = null
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
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
  
  const handleMenuClick = (action) => {
    switch (action) {
      case 'profile':
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
        break;
      case 'achievements':
        // 현재 페이지의 state 정보를 유지하면서 업적 페이지로 이동
        navigate('/achievements', { 
          state: location.state || {
            companyName: companyName || 'Black Market',
            domain: '',
            userEmail: userEmail || '',
            nickname: userNickname || '사용자',
            rememberMe: false,
            sessionStartTime: Date.now()
          }
        });
        break;
      case 'trade-requests':
        // 거래요청 확인 모달 열기 (향후 구현)
        alert('거래요청 확인 기능은 준비 중입니다.\n\n판매글에 대한 쪽지와 거래요청을 확인할 수 있습니다.');
        setIsProfileDropdownOpen(false);
        break;
      case 'change-password':
        // 비밀번호 변경 모달 열기 (향후 구현)
        alert('비밀번호 변경 기능은 준비 중입니다.\n\n현재 비밀번호를 입력하고 새로운 비밀번호로 변경할 수 있습니다.');
        setIsProfileDropdownOpen(false);
        break;
      default:
        break;
    }
  };
  
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // 기본 뒤로가기: 메인 페이지로
      navigate('/main', { 
        state: location.state || {
          companyName: companyName || 'Black Market',
          domain: '',
          userEmail: userEmail || '',
          nickname: userNickname || '사용자',
          rememberMe: false,
          sessionStartTime: Date.now()
        }
      });
    }
  };
  
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="company-info">
            <span className="company-name">{companyName}</span>
          </div>
          
          {/* 뒤로가기 버튼 - showBackButton이 true일 때만 표시 */}
          {showBackButton && (
            <button 
              className="back-button"
              onClick={handleBackClick}
              title="메인으로 돌아가기"
            >
              ← 메인으로
            </button>
          )}
        </div>
        
        {/* 네비게이션 탭 */}
        <nav className="header-nav">
          <div className="nav-tabs">
            <button 
              className="nav-tab"
              onClick={() => {
                onSellRegister();
              }}
            >
              판매등록
            </button>
            <button 
              className="nav-tab"
              onClick={() => {
                onBuyRegister();
              }}
            >
              구매등록
            </button>
            <button 
              className="nav-tab"
              onClick={() => {
                handleMenuClick('achievements');
              }}
            >
              업적
            </button>
            <button 
              className="nav-tab"
              onClick={() => {
                // About Us 페이지로 이동
                navigate('/about', { 
                  state: location.state || {
                    companyName: companyName || 'Black Market',
                    domain: '',
                    userEmail: userEmail || '',
                    nickname: userNickname || '사용자',
                    rememberMe: false,
                    sessionStartTime: Date.now()
                  }
                });
              }}
            >
              About Us
            </button>
          </div>
        </nav>
        
        <div className="header-right">
          <div className="user-info" onClick={() => handleMenuClick('profile')}>
            <span className="user-avatar">{userAvatar}</span>
            <span className="user-nickname">{userNickname}</span>
            <span className="dropdown-arrow">▼</span>
          </div>
          
          {/* 로그아웃 버튼 */}
          <button 
            className="logout-button"
            onClick={() => {
              // 로그아웃 처리
              navigate('/login');
            }}
            title="로그아웃"
          >
            로그아웃
          </button>
          
          {isProfileDropdownOpen && (
            <div className="profile-dropdown" ref={dropdownRef}>
              <div className="dropdown-item">
                <span className="dropdown-label">이메일</span>
                <span className="dropdown-value">{userEmail}</span>
              </div>
              <div className="dropdown-item">
                <span className="dropdown-label">닉네임</span>
                <span className="dropdown-value">{userNickname}</span>
              </div>
              <div className="dropdown-item">
                <button onClick={onAvatarChange}>아바타 변경</button>
              </div>
              <div className="dropdown-item">
                <button onClick={() => handleMenuClick('trade-requests')}>
                  📋 거래요청 확인
                </button>
              </div>
              <div className="dropdown-item">
                <button onClick={() => handleMenuClick('change-password')}>
                  🔒 비밀번호 변경
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
