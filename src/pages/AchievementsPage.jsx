import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import ChatSidebar from '../components/ChatSidebar';
import { useAchievementsStore } from '../stores/achievementsStore';
import '../styles/pages/AchievementsPage.css';

const AchievementsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    achievements,
    badges,
    userLevel,
    userExp,
    currentBadge,
    unlockedBadges,
    getCompletedAchievements,
    getUnlockedBadges,
    getAchievementProgress
  } = useAchievementsStore();
  
  const completedAchievements = getCompletedAchievements();
  const unlockedBadgesList = getUnlockedBadges();
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
  
  const renderOverview = () => (
    <div className="overview-section">
      <div className="user-stats">
        <Card variant="elevated" className="stats-card">
          <div className="level-display">
            <div className="level-badge">Lv.{userLevel}</div>
            <div className="exp-bar">
              <div className="exp-fill" style={{ width: `${(userExp % 1000) / 10}%` }}></div>
            </div>
            <div className="exp-text">{userExp % 1000} / 1000 EXP</div>
          </div>
        </Card>
        
        <Card variant="elevated" className="stats-card">
          <div className="progress-summary">
            <h3>업적 진행률</h3>
            <div className="progress-circle">
              <div className="progress-number">{progress.percentage}%</div>
              <div className="progress-text">{progress.completed}/{progress.total}</div>
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="stats-card">
          <div className="badge-summary">
            <h3>획득한 칭호</h3>
            <div className="badge-count">
              <span className="count-number">{unlockedBadgesList.length}</span>
              <span className="count-text">/ {badges.length}</span>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="recent-achievements">
        <h3>최근 달성한 업적</h3>
        <div className="achievements-grid">
          {completedAchievements.slice(-3).reverse().map((achievement) => (
            <Card key={achievement.id} variant="elevated" className="achievement-card completed">
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
                <span className="completion-date">
                  {new Date(achievement.completedAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
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
      <div className="page-header">
        <Button variant="secondary" size="medium" onClick={handleBackToMain}>
          ← 메인으로
        </Button>
        <h1>🏆 업적 & 칭호</h1>
      </div>
      
      <div className="page-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 개요
        </button>
        <button 
          className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          🏅 칭호
        </button>
        <button 
          className={`tab-button ${activeTab === 'quests' ? 'active' : ''}`}
          onClick={() => setActiveTab('quests')}
        >
          📋 퀘스트
        </button>
      </div>
      
      <div className="page-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'badges' && renderBadges()}
        {activeTab === 'quests' && renderQuests()}
      </div>
      
      {/* 채팅 사이드바 */}
      <ChatSidebar />
    </div>
  );
};

export default AchievementsPage;
