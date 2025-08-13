import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header';
import '../styles/pages/AboutUsPage.css';

const AboutUsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBackToMain = () => {
    navigate('/main', { 
      state: location.state || {
        companyName: 'Black Market',
        domain: '',
        userEmail: '',
        nickname: '사용자',
        rememberMe: false,
        sessionStartTime: Date.now()
      }
    });
  };
  
  // Header에 필요한 props 준비
  const headerProps = {
    companyName: location.state?.companyName || 'Black Market',
    userNickname: location.state?.nickname || '사용자',
    userEmail: location.state?.userEmail || '',
    userAvatar: location.state?.userAvatar || '👤',
    onAvatarChange: () => {}, // 아직 구현되지 않은 기능
    onSellRegister: () => {
      navigate('/main', { 
        state: location.state,
        replace: true
      });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openSellModal'));
      }, 100);
    },
    onBuyRegister: () => {
      navigate('/main', { 
        state: location.state,
        replace: true
      });
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openBuyModal'));
      }, 100);
    }
  };
  
  return (
    <div className="about-us-page">
      {/* Header 컴포넌트 사용 - 뒤로가기 버튼 표시 */}
      <Header 
        {...headerProps} 
        showBackButton={true}
      />
      
      <div className="page-content">
        <div className="page-header">
          <h1>🌟 About Us</h1>
          <p className="page-subtitle">Black Market을 만든 개발자들을 소개합니다</p>
        </div>
        
        {/* 프로젝트 소개 */}
        <div className="project-intro">
          <Card variant="elevated" className="intro-card">
            <div className="intro-content">
              <h2>🚀 Black Market</h2>
              <p className="project-description">
                Black Market은 회사 내부 포인트 거래 플랫폼에서 시작했습니다. 
                추후 식권포인트 뿐만 아니라, 상품권 등 다양한 포인트를 같은 회사 사람끼리 안전하고 효율적으로 거래할 수 있도록 
                설계되었습니다.
              </p>
              <div className="project-features">
                <div className="feature-item">
                  <span className="feature-icon">💼</span>
                  <span className="feature-text">회사 내부 거래</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span className="feature-text">보안 인증</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span className="feature-text">반응형 웹</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏆</span>
                  <span className="feature-text">업적 시스템</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* 개발자 소개 */}
        <div className="developers-section">
          <h2 className="section-title">👨‍💻 개발팀</h2>
          
          <div className="developers-grid">
            {/* 기획 & 디자인 & 프론트엔드 개발자 */}
            <Card variant="elevated" className="developer-card frontend">
              <div className="developer-header">
                <div className="developer-avatar">🎨</div>
                <div className="developer-role">Frontend Developer - 강현빈</div>
              </div>
              
              <div className="developer-info">
                <h3 className="developer-name">기획 & 디자인 & 프론트엔드</h3>
                <p className="developer-description">
                  사용자 경험과 시각적 디자인에 중점을 두고 
                  직관적이고 아름다운 인터페이스를 구현했습니다.
                </p>
                
                <div className="developer-skills">
                  <h4>주요 기술</h4>
                  <div className="skills-grid">
                    <span className="skill-tag">React</span>
                    <span className="skill-tag">JavaScript</span>
                    <span className="skill-tag">CSS3</span>
                    <span className="skill-tag">UI/UX</span>
                    <span className="skill-tag">기획</span>
                    <span className="skill-tag">디자인</span>
                  </div>
                </div>
                
                <div className="developer-responsibilities">
                  <h4>담당 영역</h4>
                  <ul>
                    <li>📋 프로젝트 기획 및 요구사항 분석</li>
                    <li>🎨 UI/UX 디자인 및 사용자 경험 설계</li>
                    <li>⚛️ React 기반 프론트엔드 개발</li>
                    <li>📱 반응형 웹 디자인 구현</li>
                    <li>🎯 사용자 인터페이스 최적화</li>
                  </ul>
                </div>
                
                {/* 개발자 링크 */}
                <div className="developer-links">
                  <h4>🔗 링크</h4>
                  <div className="links-grid">
                    <a 
                      href="https://github.com/Crush-on-Study" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link-button github"
                    >
                      <span className="link-icon">📚</span>
                      <span className="link-text">GitHub</span>
                    </a>
                    <a 
                      href="https://myresume-3d74d.web.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link-button portfolio"
                    >
                      <span className="link-icon">🌐</span>
                      <span className="link-text">Portfolio</span>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* 백엔드 & 인프라 개발자 */}
            <Card variant="elevated" className="developer-card backend">
              <div className="developer-header">
                <div className="developer-avatar">⚙️</div>
                <div className="developer-role">Backend Developer - 성민제</div>
              </div>
              
              <div className="developer-info">
                <h3 className="developer-name">백엔드 & 인프라</h3>
                <p className="developer-description">
                  안정적이고 확장 가능한 서버 아키텍처를 구축하고 
                  데이터베이스 설계 및 API 개발을 담당했습니다.
                </p>
                
                <div className="developer-skills">
                  <h4>주요 기술</h4>
                  <div className="skills-grid">
                    <span className="skill-tag">Python</span>
                    <span className="skill-tag">FastAPI</span>
                    <span className="skill-tag">Database (postgres)</span>
                    <span className="skill-tag">API</span>
                    <span className="skill-tag">AWS</span>
                  </div>
                </div>
                
                <div className="developer-responsibilities">
                  <h4>담당 영역</h4>
                  <ul>
                    <li>🖥️ 서버 아키텍처 설계 및 구축</li>
                    <li>🗄️ 데이터베이스 설계 및 최적화</li>
                    <li>🔌 RESTful API 개발 및 문서화</li>
                    <li>☁️ 클라우드 인프라 관리</li>
                    <li>🔒 보안 및 인증 시스템 구현</li>
                  </ul>
                </div>
                
                {/* 개발자 링크 */}
                <div className="developer-links">
                  <h4>🔗 링크</h4>
                  <div className="links-grid">
                    <a 
                      href="https://github.com/mjcode1588" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link-button github"
                    >
                      <span className="link-icon">📚</span>
                      <span className="link-text">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* 프로젝트 정보 */}
        <div className="project-info">
          <Card variant="elevated" className="info-card">
            <h3>📊 프로젝트 정보</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">개발 기간</span>
                <span className="info-value">2025년 8월 ~ 현재</span>
              </div>
              <div className="info-item">
                <span className="info-label">프로젝트 규모</span>
                <span className="info-value">2명의 개발자</span>
              </div>
              <div className="info-item">
                <span className="info-label">기술 스택</span>
                <span className="info-value">React + Python</span>
              </div>
              <div className="info-item">
                <span className="info-label">배포 환경</span>
                <span className="info-value">AWS 클라우드 기반</span>
              </div>
            </div>
          </Card>
        </div>
        
        {/* 오픈소스 출처 */}
        <div className="opensource-section">
          <Card variant="elevated" className="opensource-card">
            <h3>📚 오픈소스 출처</h3>
            <p className="opensource-description">
              이 프로젝트는 다양한 오픈소스 프로젝트들의 도움을 받아 개발되었습니다. 
              오픈소스 커뮤니티에 감사드립니다.
            </p>
            
            <div className="opensource-list">
              <div className="opensource-item">
                <div className="opensource-header">
                  <div className="opensource-icon">⚛️</div>
                  <div className="opensource-info">
                    <h4 className="opensource-name">React-bits</h4>
                    <p className="opensource-description-text">
                      React 개발에 유용한 패턴과 모범 사례를 제공하는 오픈소스 프로젝트입니다.
                    </p>
                  </div>
                </div>
                
                <div className="opensource-links">
                  <a 
                    href="https://github.com/DavidHDev/react-bits" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="opensource-link github"
                  >
                    <span className="link-icon">📚</span>
                    <span className="link-text">GitHub</span>
                  </a>
                  <a 
                    href="https://reactbits.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="opensource-link website"
                  >
                    <span className="link-icon">🌐</span>
                    <span className="link-text">공식 사이트</span>
                  </a>
                </div>
                
                <div className="opensource-license">
                  <span className="license-badge">MIT License</span>
                  <span className="license-text">자유롭게 사용 가능한 라이선스</span>
                </div>
              </div>
              
              {/* 추가 오픈소스가 있다면 여기에 추가 */}
              <div className="opensource-item">
                <div className="opensource-header">
                  <div className="opensource-icon">🎨</div>
                  <div className="opensource-info">
                    <h4 className="opensource-name">기타 오픈소스</h4>
                    <p className="opensource-description-text">
                      React, Vite, Zustand 등 다양한 오픈소스 라이브러리를 활용했습니다.
                    </p>
                  </div>
                </div>
                
                <div className="opensource-links">
                  <a 
                    href="https://reactjs.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="opensource-link react"
                  >
                    <span className="link-icon">⚛️</span>
                    <span className="link-text">React</span>
                  </a>
                  <a 
                    href="https://vitejs.dev/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="opensource-link vite"
                  >
                    <span className="link-icon">⚡</span>
                    <span className="link-text">Vite</span>
                  </a>
                  <a 
                    href="https://github.com/pmndrs/zustand" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="opensource-link zustand"
                  >
                    <span className="link-icon">🐻</span>
                    <span className="link-text">Zustand</span>
                  </a>
                </div>
                
                <div className="opensource-license">
                  <span className="license-badge">MIT License</span>
                  <span className="license-text">각 라이브러리별 라이선스 준수</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* 연락처 */}
        <div className="contact-section">
          <Card variant="elevated" className="contact-card">
            <h3>📞 문의 및 피드백</h3>
            <p className="contact-description">
              Black Market에 대한 문의사항이나 개선 제안이 있으시면 
              언제든지 연락해주세요.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span className="contact-text">이메일: twonkang00@naver.com</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
