import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header';
import ChatBar from '../components/ChatBar';
import { useAchievementsStore } from '../stores/achievementsStore';
import '../styles/pages/AchievementsPage.css';

const AchievementsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    userLevel,
    userExp,
    achievements,
    badges,
    currentBadge
  } = useAchievementsStore();
  
  // 업적 진행도 계산 함수
  const getAchievementProgress = () => {
    const completed = achievements.filter(a => a.completed).length;
    const total = achievements.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      completed,
      total,
      percentage
    };
  };
  
  const progress = getAchievementProgress();
  
  const handleBackToMain = () => {
    // 현재 페이지의 state 정보를 유지하면서 메인 페이지로 이동
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
      // 판매등록 모달 열기 (메인 페이지로 이동하여 처리)
      navigate('/main', { 
        state: location.state,
        replace: true
      });
      // 메인 페이지에서 판매등록 모달 열기
      setTimeout(() => {
        // 메인 페이지의 handleSellRegister 함수 호출을 위한 시그널
        window.dispatchEvent(new CustomEvent('openSellModal'));
      }, 100);
    },
    onBuyRegister: () => {
      // 구매등록 모달 열기 (메인 페이지로 이동하여 처리)
      navigate('/main', { 
        state: location.state,
        replace: true
      });
      // 메인 페이지에서 구매등록 모달 열기
      setTimeout(() => {
        // 메인 페이지의 handleBuyRegister 함수 호출을 위한 시그널
        window.dispatchEvent(new CustomEvent('openBuyModal'));
      }, 100);
    }
  };
  
  const renderOverview = () => (
    <div className="overview-section">
      {/* 사용자 통계 카드들 */}
      <div className="user-stats">
        <Card variant="elevated" className="stats-card level-card">
          <div className="level-display">
            <div className="level-badge">
              <span className="level-number">Lv.{userLevel}</span>
              <div className="level-glow"></div>
            </div>
            <div className="exp-container">
              <div className="exp-bar">
                <div className="exp-fill" style={{ width: `${(userExp % 1000) / 10}%` }}></div>
                <div className="exp-particles"></div>
              </div>
              <div className="exp-text">
                <span className="current-exp">{userExp % 1000}</span>
                <span className="exp-separator">/</span>
                <span className="max-exp">1000 EXP</span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="stats-card progress-card">
          <div className="progress-summary">
            <h3 className="progress-title">업적 진행률</h3>
            <div className="progress-circle">
              <svg className="progress-ring" viewBox="0 0 120 120">
                <circle 
                  className="progress-ring-bg" 
                  cx="60" cy="60" r="54" 
                  strokeWidth="8"
                />
                <circle 
                  className="progress-ring-fill" 
                  cx="60" cy="60" r="54" 
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress.percentage / 100)}`}
                />
              </svg>
              <div className="progress-content">
                <div className="progress-number">{progress.percentage}%</div>
                <div className="progress-text">{progress.completed}/{progress.total}</div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="stats-card badge-card">
          <div className="badge-summary">
            <h3 className="badge-title">획득한 칭호</h3>
            <div className="badge-count">
              <div className="count-circle">
                <span className="count-number">{badges.filter(b => b.unlocked).length}</span>
              </div>
              <div className="count-info">
                <span className="count-text">/ {badges.length}</span>
                <span className="count-label">칭호</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* 최근 달성한 업적 */}
      <div className="recent-achievements">
        <div className="section-header">
          <h3 className="section-title">🏆 최근 달성한 업적</h3>
          <div className="section-decoration"></div>
        </div>
        <div className="achievements-grid">
          {achievements.filter(a => a.completed).slice(-3).reverse().map((achievement) => (
            <Card key={achievement.id} variant="elevated" className="achievement-card completed">
              <div className="achievement-header">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-status">
                  <span className="status-badge">달성!</span>
                </div>
              </div>
              <div className="achievement-info">
                <h4 className="achievement-name">{achievement.name}</h4>
                <p className="achievement-description">{achievement.description}</p>
                <div className="achievement-meta">
                  <span className="completion-date">
                    📅 {new Date(achievement.completedAt).toLocaleDateString()}
                  </span>
                  <span className="achievement-reward">
                    🏆 +{achievement.reward.exp} EXP
                  </span>
                </div>
              </div>
              <div className="achievement-glow"></div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* 업적 통계 요약 */}
      <div className="achievement-stats">
        <Card variant="elevated" className="stats-summary-card">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-value">{progress.completed}</span>
                <span className="stat-label">달성한 업적</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <span className="stat-value">{progress.total - progress.completed}</span>
                <span className="stat-label">남은 업적</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <span className="stat-value">{userExp}</span>
                <span className="stat-label">총 경험치</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏅</div>
              <div className="stat-content">
                <span className="stat-value">{badges.filter(b => b.unlocked).length}</span>
                <span className="stat-label">획득 칭호</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
  
  const renderBadges = () => (
    <div className="badges-section">
      <div className="badges-grid">
        {badges.map((badge) => (
          <Card 
            key={badge.id} 
            variant="elevated" 
            className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-info">
              <h4>{badge.name}</h4>
              <p>{badge.description}</p>
              <div className="badge-rarity">{badge.rarity}</div>
            </div>
            {badge.unlocked && (
              <div className="unlock-date">
                {new Date(badge.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
  
  const renderQuests = () => (
    <div className="quests-section">
      <div className="quests-grid">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            variant="elevated" 
            className={`quest-card ${achievement.completed ? 'completed' : 'in-progress'}`}
          >
            <div className="quest-header">
              <div className="quest-icon">{achievement.icon}</div>
              <div className="quest-info">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
              </div>
              <div className="quest-status">
                {achievement.completed ? '✅' : '🔄'}
              </div>
            </div>
            
            {!achievement.completed && (
              <div className="quest-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(achievement.progress / achievement.requirement.value) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {achievement.progress} / {achievement.requirement.value}
                </span>
              </div>
            )}
            
            <div className="quest-reward">
              <span className="reward-badge">🏆 {achievement.reward.badge}</span>
              <span className="reward-exp">+{achievement.reward.exp} EXP</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
  
  return (
    <div className="achievements-page">
      {/* Header 컴포넌트 사용 - 뒤로가기 버튼 표시 */}
      <Header 
        {...headerProps} 
        showBackButton={true}
      />
      
      <div className="page-content">
        
        <div className="page-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            개요
          </button>
          <button 
            className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            배지
          </button>
          <button 
            className={`tab-button ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            퀘스트
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'badges' && renderBadges()}
          {activeTab === 'quests' && renderQuests()}
        </div>
      </div>
      
      {/* 채팅 사이드바 */}
      <ChatBar userNickname={location.state?.nickname || '사용자'} />
    </div>
  );
};

export default AchievementsPage;
