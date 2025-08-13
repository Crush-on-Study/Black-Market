import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/pages/SecurityPage.css';

const SecurityPage = () => {
  const navigate = useNavigate();
  
  const handleGoToLogin = () => {
    navigate('/login');
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="security-page">
      <div className="security-container">
        <div className="security-icon">🚫</div>
        <h1>잘못된 접근 방식입니다</h1>
        <p className="security-message">
          이 페이지에 접근하려면 먼저 로그인이 필요합니다.
        </p>
        <div className="security-actions">
          <Button variant="primary" size="large" onClick={handleGoToLogin}>
            로그인 페이지로 이동
          </Button>
          <Button variant="secondary" size="large" onClick={handleGoBack}>
            이전 페이지로 돌아가기
          </Button>
        </div>
        <div className="security-info">
          <p>보안을 위해 인증되지 않은 사용자의 접근을 차단했습니다.</p>
          <p>계정이 없다면 회원가입 후 이용해주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
