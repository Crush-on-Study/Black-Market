import { useState, useCallback, useMemo } from 'react';

/**
 * 공통 로딩 상태 관리를 위한 커스텀 훅
 * @param {Object} options - 로딩 상태 옵션
 * @param {boolean} options.initialState - 초기 로딩 상태
 * @param {number} options.minLoadingTime - 최소 로딩 시간 (ms)
 * @param {boolean} options.showLoadingIndicator - 로딩 인디케이터 표시 여부
 * @returns {Object} 로딩 상태와 관련 함수들
 */
export const useLoadingState = (options = {}) => {
  const {
    initialState = false,
    minLoadingTime = 300,
    showLoadingIndicator = true
  } = options;

  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(new Set());

  // 로딩 시작
  const startLoading = useCallback((taskId = 'default') => {
    setLoadingStartTime(Date.now());
    setLoadingTasks(prev => new Set(prev).add(taskId));
    setIsLoading(true);
  }, []);

  // 로딩 완료
  const stopLoading = useCallback((taskId = 'default') => {
    setLoadingTasks(prev => {
      const newTasks = new Set(prev);
      newTasks.delete(taskId);
      return newTasks;
    });

    // 모든 태스크가 완료되었는지 확인
    if (loadingTasks.size <= 1) {
      const elapsedTime = Date.now() - (loadingStartTime || 0);
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      if (remainingTime > 0) {
        // 최소 로딩 시간 보장
        setTimeout(() => {
          setIsLoading(false);
          setLoadingStartTime(null);
        }, remainingTime);
      } else {
        setIsLoading(false);
        setLoadingStartTime(null);
      }
    }
  }, [loadingTasks, loadingStartTime, minLoadingTime]);

  // 비동기 작업을 로딩 상태와 함께 실행
  const withLoading = useCallback(async (asyncFn, taskId = 'default') => {
    try {
      startLoading(taskId);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading(taskId);
    }
  }, [startLoading, stopLoading]);

  // 여러 비동기 작업을 병렬로 실행하면서 로딩 상태 관리
  const withLoadingMultiple = useCallback(async (asyncFns, taskId = 'default') => {
    try {
      startLoading(taskId);
      const results = await Promise.all(asyncFns);
      return results;
    } finally {
      stopLoading(taskId);
    }
  }, [startLoading, stopLoading]);

  // 로딩 상태 초기화
  const resetLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingStartTime(null);
    setLoadingTasks(new Set());
  }, []);

  // 특정 태스크의 로딩 상태 확인
  const isTaskLoading = useCallback((taskId) => {
    return loadingTasks.has(taskId);
  }, [loadingTasks]);

  // 로딩 진행률 계산 (0-100)
  const loadingProgress = useMemo(() => {
    if (!isLoading || !loadingStartTime) return 0;
    
    const elapsedTime = Date.now() - loadingStartTime;
    const progress = Math.min((elapsedTime / minLoadingTime) * 100, 100);
    return Math.round(progress);
  }, [isLoading, loadingStartTime, minLoadingTime]);

  // 로딩 상태 통계
  const loadingStats = useMemo(() => {
    return {
      isLoading,
      activeTasks: loadingTasks.size,
      progress: loadingProgress,
      elapsedTime: loadingStartTime ? Date.now() - loadingStartTime : 0
    };
  }, [isLoading, loadingTasks, loadingProgress, loadingStartTime]);

  return {
    // 상태
    isLoading,
    loadingProgress,
    loadingStats,
    
    // 액션
    startLoading,
    stopLoading,
    withLoading,
    withLoadingMultiple,
    resetLoading,
    isTaskLoading
  };
};

/**
 * 특정 작업을 위한 전용 로딩 훅
 * @param {string} taskName - 작업 이름
 * @returns {Object} 해당 작업의 로딩 상태
 */
export const useTaskLoading = (taskName) => {
  const loadingState = useLoadingState();
  
  return {
    ...loadingState,
    startTask: () => loadingState.startLoading(taskName),
    stopTask: () => loadingState.stopLoading(taskName),
    isTaskLoading: loadingState.isTaskLoading(taskName),
    withTask: (asyncFn) => loadingState.withLoading(asyncFn, taskName)
  };
};

/**
 * 폼 제출 로딩 상태 전용 훅
 */
export const useFormLoading = () => {
  return useTaskLoading('form-submit');
};

/**
 * 데이터 로딩 상태 전용 훅
 */
export const useDataLoading = () => {
  return useTaskLoading('data-loading');
};

/**
 * 파일 업로드 로딩 상태 전용 훅
 */
export const useFileUploadLoading = () => {
  return useTaskLoading('file-upload');
};

/**
 * 검색 로딩 상태 전용 훅
 */
export const useSearchLoading = () => {
  return useTaskLoading('search');
};
