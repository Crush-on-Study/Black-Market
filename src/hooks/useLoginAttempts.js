import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * 로그인 시도 제한을 관리하는 커스텀 훅
 * @param {Object} options - 설정 옵션
 * @param {number} options.maxAttempts - 최대 시도 횟수
 * @param {number} options.lockoutDuration - 잠금 시간 (ms)
 * @param {number} options.resetDuration - 시도 횟수 리셋 시간 (ms)
 * @returns {Object} 로그인 시도 관리 함수들과 상태
 */
export const useLoginAttempts = (options = {}) => {
  const {
    maxAttempts = 5,
    lockoutDuration = 15 * 60 * 1000, // 15분
    resetDuration = 60 * 60 * 1000 // 1시간
  } = options;

  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  // 로컬 스토리지에서 시도 기록 복원
  useEffect(() => {
    try {
      const stored = localStorage.getItem('loginAttempts');
      if (stored) {
        const data = JSON.parse(stored);
        const now = Date.now();
        
        // 잠금 시간이 지났는지 확인
        if (data.lockoutUntil && now < data.lockoutUntil) {
          setLockoutUntil(data.lockoutUntil);
        } else if (data.lockoutUntil && now >= data.lockoutUntil) {
          // 잠금 시간이 지났으면 기록 초기화
          resetAttempts();
          return;
        }
        
        // 리셋 시간이 지났는지 확인
        if (data.lastAttemptTime && (now - data.lastAttemptTime) > resetDuration) {
          resetAttempts();
        } else {
          setAttempts(data.attempts || 0);
          setLastAttemptTime(data.lastAttemptTime);
        }
      }
    } catch (error) {
      console.warn('로그인 시도 기록 복원 실패:', error);
    }
  }, [resetDuration]);

  // 로컬 스토리지에 시도 기록 저장
  const saveToStorage = useCallback((data) => {
    try {
      localStorage.setItem('loginAttempts', JSON.stringify(data));
    } catch (error) {
      console.warn('로그인 시도 기록 저장 실패:', error);
    }
  }, []);

  // 로그인 시도 기록
  const recordAttempt = useCallback((success = false) => {
    const now = Date.now();
    
    if (success) {
      // 성공 시 기록 초기화
      resetAttempts();
      return;
    }

    const newAttempts = attempts + 1;
    const newLastAttemptTime = now;
    
    setAttempts(newAttempts);
    setLastAttemptTime(newLastAttemptTime);

    // 최대 시도 횟수에 도달하면 잠금
    if (newAttempts >= maxAttempts) {
      const newLockoutUntil = now + lockoutDuration;
      setLockoutUntil(newLockoutUntil);
      
      saveToStorage({
        attempts: newAttempts,
        lastAttemptTime: newLastAttemptTime,
        lockoutUntil: newLockoutUntil
      });
    } else {
      saveToStorage({
        attempts: newAttempts,
        lastAttemptTime: newLastAttemptTime,
        lockoutUntil: null
      });
    }
  }, [attempts, maxAttempts, lockoutDuration, saveToStorage]);

  // 시도 기록 초기화
  const resetAttempts = useCallback(() => {
    setAttempts(0);
    setLastAttemptTime(null);
    setLockoutUntil(null);
    localStorage.removeItem('loginAttempts');
  }, []);

  // 잠금 상태 확인
  const isLocked = useMemo(() => {
    if (!lockoutUntil) return false;
    return Date.now() < lockoutUntil;
  }, [lockoutUntil]);

  // 남은 잠금 시간 계산
  const remainingLockoutTime = useMemo(() => {
    if (!isLocked) return 0;
    return Math.max(0, lockoutUntil - Date.now());
  }, [isLocked, lockoutUntil]);

  // 잠금 해제까지 남은 시간 (사용자 친화적)
  const getRemainingTimeText = useCallback(() => {
    if (!isLocked) return '';
    
    const minutes = Math.ceil(remainingLockoutTime / (60 * 1000));
    if (minutes >= 60) {
      const hours = Math.ceil(minutes / 60);
      return `${hours}시간`;
    }
    return `${minutes}분`;
  }, [isLocked, remainingLockoutTime]);

  // 시도 횟수 상태
  const attemptsStatus = useMemo(() => {
    return {
      current: attempts,
      remaining: Math.max(0, maxAttempts - attempts),
      isAtLimit: attempts >= maxAttempts,
      isLocked,
      remainingLockoutTime,
      remainingTimeText: getRemainingTimeText()
    };
  }, [attempts, maxAttempts, isLocked, remainingLockoutTime, getRemainingTimeText]);

  return {
    // 상태
    attempts,
    lastAttemptTime,
    isLocked,
    remainingLockoutTime,
    attemptsStatus,
    
    // 액션
    recordAttempt,
    resetAttempts,
    getRemainingTimeText
  };
};
