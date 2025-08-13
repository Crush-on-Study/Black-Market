import { create } from 'zustand';
import { achievements, badges } from '../data/achievements';

export const useAchievementsStore = create((set, get) => ({
  // 상태
  achievements: achievements,
  badges: badges,
  userLevel: 1,
  userExp: 0,
  currentBadge: null,
  unlockedBadges: [],
  
  // 액션
  updateAchievementProgress: (achievementId, progress) => {
    set((state) => ({
      achievements: state.achievements.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, progress }
          : achievement
      )
    }));
  },
  
  completeAchievement: (achievementId) => {
    const state = get();
    const achievement = state.achievements.find(a => a.id === achievementId);
    
    if (achievement && !achievement.completed) {
      // 업적 완료 처리
      set((state) => ({
        achievements: state.achievements.map(a => 
          a.id === achievementId 
            ? { ...a, completed: true, completedAt: new Date() }
            : a
        )
      }));
      
      // 칭호 해금
      const badgeId = achievement.reward.badge;
      const badge = state.badges.find(b => b.id === badgeId);
      
      if (badge) {
        set((state) => ({
          badges: state.badges.map(b => 
            b.id === badgeId 
              ? { ...b, unlocked: true, unlockedAt: new Date() }
              : b
          ),
          unlockedBadges: [...state.unlockedBadges, badgeId]
        }));
      }
      
      // 경험치 획득
      const expGain = achievement.reward.exp;
      set((state) => {
        const newExp = state.userExp + expGain;
        const newLevel = Math.floor(newExp / 1000) + 1;
        
        return {
          userExp: newExp,
          userLevel: newLevel
        };
      });
      
      return { achievement, badge, expGain };
    }
    
    return null;
  },
  
  setCurrentBadge: (badgeId) => {
    set({ currentBadge: badgeId });
  },
  
  // 계산된 값들
  getCompletedAchievements: () => {
    const state = get();
    return state.achievements.filter(a => a.completed);
  },
  
  getUnlockedBadges: () => {
    const state = get();
    return state.badges.filter(b => b.unlocked);
  },
  
  getAchievementProgress: () => {
    const state = get();
    const total = state.achievements.length;
    const completed = state.achievements.filter(a => a.completed).length;
    return { total, completed, percentage: Math.round((completed / total) * 100) };
  },
  
  // 거래 관련 업적 체크
  checkTradeAchievements: (tradeData) => {
    const state = get();
    const { totalTrades, totalAmount, singleDealAmount, dailyTradeCount } = tradeData;
    
    // 거래 횟수 업적 체크
    const tradeCountAchievements = state.achievements.filter(a => 
      a.requirement.type === 'trade_count' && !a.completed
    );
    
    tradeCountAchievements.forEach(achievement => {
      if (totalTrades >= achievement.requirement.value) {
        get().completeAchievement(achievement.id);
      }
    });
    
    // 총 거래 금액 업적 체크
    const amountAchievements = state.achievements.filter(a => 
      a.requirement.type === 'total_amount' && !a.completed
    );
    
    amountAchievements.forEach(achievement => {
      if (totalAmount >= achievement.requirement.value) {
        get().completeAchievement(achievement.id);
      }
    });
    
    // 단일 거래 금액 업적 체크
    if (singleDealAmount >= 1000000) {
      const bigDealAchievement = state.achievements.find(a => a.id === 'big_deal');
      if (bigDealAchievement && !bigDealAchievement.completed) {
        get().completeAchievement('big_deal');
      }
    }
    
    // 일일 거래 횟수 업적 체크
    if (dailyTradeCount >= 10) {
      const dailyAchievement = state.achievements.find(a => a.id === 'daily_10');
      if (dailyAchievement && !dailyAchievement.completed) {
        get().completeAchievement('daily_10');
      }
    }
  },
  
  // 초기화
  resetAchievements: () => {
    set({
      achievements: achievements.map(a => ({ ...a, progress: 0, completed: false, completedAt: null })),
      badges: badges.map(b => ({ ...b, unlocked: false, unlockedAt: null })),
      userLevel: 1,
      userExp: 0,
      currentBadge: null,
      unlockedBadges: []
    });
  }
}));
