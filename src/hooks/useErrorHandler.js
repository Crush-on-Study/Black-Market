import { useState, useCallback, useMemo } from 'react';

/**
 * 공통 에러 처리를 위한 커스텀 훅
 * @param {Object} options - 에러 처리 옵션
 * @param {boolean} options.showToast - 토스트 메시지 표시 여부
 * @param {boolean} options.logToConsole - 콘솔에 로그 출력 여부
 * @param {Function} options.onError - 에러 발생 시 콜백 함수
 * @returns {Object} 에러 처리 함수들과 상태
 */
export const useErrorHandler = (options = {}) => {
  const {
    showToast = true,
    logToConsole = true,
    onError = null
  } = options;

  const [errors, setErrors] = useState([]);
  const [isError, setIsError] = useState(false);

  // 에러 추가
  const addError = useCallback((error, context = {}) => {
    const errorInfo = {
      id: Date.now(),
      message: error?.message || error?.toString() || '알 수 없는 오류가 발생했습니다',
      error,
      context,
      timestamp: new Date().toISOString(),
      stack: error?.stack
    };

    setErrors(prev => [...prev, errorInfo]);
    setIsError(true);

    // 콘솔에 로그 출력
    if (logToConsole) {
      console.error('Error occurred:', errorInfo);
    }

    // 에러 발생 시 콜백 실행
    if (onError) {
      onError(errorInfo);
    }

    return errorInfo.id;
  }, [logToConsole, onError]);

  // 에러 제거
  const removeError = useCallback((errorId) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
    setIsError(false);
  }, []);

  // 모든 에러 제거
  const clearErrors = useCallback(() => {
    setErrors([]);
    setIsError(false);
  }, []);

  // 특정 에러 타입의 에러만 제거
  const clearErrorsByType = useCallback((errorType) => {
    setErrors(prev => prev.filter(error => error.context?.type !== errorType));
  }, []);

  // 에러 발생 시 안전한 함수 실행
  const safeExecute = useCallback(async (fn, context = {}) => {
    try {
      return await fn();
    } catch (error) {
      addError(error, context);
      throw error; // 에러를 다시 던져서 상위에서 처리할 수 있도록
    }
  }, [addError]);

  // 에러 발생 시 기본값 반환하는 함수 실행
  const safeExecuteWithFallback = useCallback(async (fn, fallback, context = {}) => {
    try {
      return await fn();
    } catch (error) {
      addError(error, context);
      return fallback;
    }
  }, [addError]);

  // 에러 통계 정보
  const errorStats = useMemo(() => {
    const totalErrors = errors.length;
    const recentErrors = errors.filter(error => {
      const errorTime = new Date(error.timestamp);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return errorTime > oneHourAgo;
    });

    return {
      total: totalErrors,
      recent: recentErrors.length,
      hasErrors: totalErrors > 0,
      lastError: errors[totalErrors - 1] || null
    };
  }, [errors]);

  // 에러 타입별 분류
  const errorsByType = useMemo(() => {
    return errors.reduce((acc, error) => {
      const type = error.context?.type || 'unknown';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(error);
      return acc;
    }, {});
  }, [errors]);

  return {
    // 상태
    errors,
    isError,
    errorStats,
    errorsByType,
    
    // 액션
    addError,
    removeError,
    clearErrors,
    clearErrorsByType,
    safeExecute,
    safeExecuteWithFallback
  };
};

/**
 * 특정 에러 타입을 위한 전용 훅
 * @param {string} errorType - 에러 타입
 * @returns {Object} 해당 타입의 에러 처리 함수들
 */
export const useTypedErrorHandler = (errorType) => {
  const errorHandler = useErrorHandler({
    onError: (errorInfo) => {
      // 특정 타입의 에러만 처리
      if (errorInfo.context?.type === errorType) {
        // 타입별 특별한 처리 로직
        console.warn(`${errorType} 에러 발생:`, errorInfo);
      }
    }
  });

  return {
    ...errorHandler,
    addTypedError: (error, additionalContext = {}) => {
      return errorHandler.addError(error, { type: errorType, ...additionalContext });
    },
    clearTypedErrors: () => {
      errorHandler.clearErrorsByType(errorType);
    }
  };
};

/**
 * 네트워크 에러 전용 훅
 */
export const useNetworkErrorHandler = () => {
  return useTypedErrorHandler('network');
};

/**
 * 유효성 검사 에러 전용 훅
 */
export const useValidationErrorHandler = () => {
  return useTypedErrorHandler('validation');
};

/**
 * 권한 에러 전용 훅
 */
export const usePermissionErrorHandler = () => {
  return useTypedErrorHandler('permission');
};
