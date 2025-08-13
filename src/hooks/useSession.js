import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * 세션 관리를 위한 커스텀 훅
 * @param {Object} options - 설정 옵션
 * @param {number} options.sessionTimeout - 세션 타임아웃 (ms)
 * @param {number} options.warningTime - 경고 표시 시간 (ms)
 * @param {boolean} options.autoLogout - 자동 로그아웃 여부
 * @returns {Object} 세션 관리 함수들과 상태
 */
export const useSession = (options = {}) => {
  const {
    sessionTimeout = 30 * 60 * 1000, // 30분
    warningTime = 5 * 60 * 1000, // 5분 전 경고
    autoLogout = true
  } = options;

  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [lastActivityTime, setLastActivityTime] = useState(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // 세션 시작
  const startSession = useCallback(() => {
    const now = Date.now();
    setSessionStartTime(now);
    setLastActivityTime(now);
    setIsSessionExpired(false);
    setShowWarning(false);
    
    // 로컬 스토리지에 세션 정보 저장
    try {
      localStorage.setItem('sessionInfo', JSON.stringify({
        startTime: now,
        lastActivity: now
      }));
    } catch (error) {
      console.warn('세션 정보 저장 실패:', error);
    }
  }, []);

  // 세션 종료
  const endSession = useCallback(() => {
    setSessionStartTime(null);
    setLastActivityTime(null);
    setIsSessionExpired(false);
    setShowWarning(false);
    setRemainingTime(0);
    
    // 로컬 스토리지에서 세션 정보 제거
    try {
      localStorage.removeItem('sessionInfo');
    } catch (error) {
      console.warn('세션 정보 제거 실패:', error);
    }
  }, []);

  // 활동 감지 (마우스, 키보드, 터치)
  const updateActivity = useCallback(() => {
    if (sessionStartTime) {
      const now = Date.now();
      setLastActivityTime(now);
      
      // 로컬 스토리지 업데이트
      try {
        const stored = localStorage.getItem('sessionInfo');
        if (stored) {
          const sessionInfo = JSON.parse(stored);
          sessionInfo.lastActivity = now;
          localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));
        }
      } catch (error) {
        console.warn('세션 활동 업데이트 실패:', error);
      }
    }
  }, [sessionStartTime]);

  // 세션 연장
  const extendSession = useCallback(() => {
    if (sessionStartTime) {
      const now = Date.now();
      setSessionStartTime(now);
      setLastActivityTime(now);
      setIsSessionExpired(false);
      setShowWarning(false);
      
      // 로컬 스토리지 업데이트
      try {
        const stored = localStorage.getItem('sessionInfo');
        if (stored) {
          const sessionInfo = JSON.parse(stored);
          sessionInfo.startTime = now;
          sessionInfo.lastActivity = now;
          localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));
        }
      } catch (error) {
        console.warn('세션 연장 실패:', error);
      }
    }
  }, [sessionStartTime]);

  // 세션 상태 확인
  const checkSessionStatus = useCallback(() => {
    if (!sessionStartTime || !lastActivityTime) return;

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTime;
    const timeSinceSessionStart = now - sessionStartTime;

    // 세션 타임아웃 체크
    if (timeSinceLastActivity > sessionTimeout) {
      setIsSessionExpired(true);
      setShowWarning(false);
      if (autoLogout) {
        endSession();
      }
      return;
    }

    // 경고 시간 체크
    if (timeSinceLastActivity > (sessionTimeout - warningTime)) {
      setShowWarning(true);
      setRemainingTime(sessionTimeout - timeSinceLastActivity);
    } else {
      setShowWarning(false);
      setRemainingTime(0);
    }
  }, [sessionStartTime, lastActivityTime, sessionTimeout, warningTime, autoLogout, endSession]);

  // 남은 시간 텍스트 생성
  const getRemainingTimeText = useCallback(() => {
    if (remainingTime <= 0) return '';
    
    const minutes = Math.ceil(remainingTime / (60 * 1000));
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}시간 ${remainingMinutes}분`;
    }
    return `${minutes}분`;
  }, [remainingTime]);

  // 세션 정보 복원
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sessionInfo');
      if (stored) {
        const sessionInfo = JSON.parse(stored);
        const now = Date.now();
        
        // 세션이 유효한지 확인
        if (now - sessionInfo.lastActivity < sessionTimeout) {
          setSessionStartTime(sessionInfo.startTime);
          setLastActivityTime(sessionInfo.lastActivity);
          checkSessionStatus();
        } else {
          // 만료된 세션 정보 제거
          localStorage.removeItem('sessionInfo');
        }
      }
    } catch (error) {
      console.warn('세션 정보 복원 실패:', error);
    }
  }, [sessionTimeout, checkSessionStatus]);

  // 활동 감지 이벤트 리스너
  useEffect(() => {
    if (!sessionStartTime) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [sessionStartTime, updateActivity]);

  // 세션 상태 주기적 체크
  useEffect(() => {
    if (!sessionStartTime) return;

    const interval = setInterval(checkSessionStatus, 1000); // 1초마다 체크

    return () => clearInterval(interval);
  }, [sessionStartTime, checkSessionStatus]);

  // 세션 통계
  const sessionStats = useMemo(() => {
    if (!sessionStartTime) return null;

    const now = Date.now();
    const elapsed = now - sessionStartTime;
    const remaining = Math.max(0, sessionTimeout - (now - lastActivityTime));

    return {
      elapsed,
      remaining,
      elapsedText: formatTime(elapsed),
      remainingText: formatTime(remaining),
      progress: Math.min(100, (elapsed / sessionTimeout) * 100)
    };
  }, [sessionStartTime, lastActivityTime, sessionTimeout]);

  // 시간 포맷팅 헬퍼
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / (60 * 1000));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}시간 ${minutes % 60}분`;
    }
    return `${minutes}분`;
  };

  return {
    // 상태
    sessionStartTime,
    lastActivityTime,
    isSessionExpired,
    showWarning,
    remainingTime,
    sessionStats,
    
    // 액션
    startSession,
    endSession,
    extendSession,
    updateActivity,
    
    // 유틸리티
    getRemainingTimeText,
    formatTime
  };
};
