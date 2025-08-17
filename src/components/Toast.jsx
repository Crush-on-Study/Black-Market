import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../styles/components/Toast.css';

const Toast = ({
  id,
  message = '',
  type = 'info',
  duration = 5000,
  position = 'top-right',
  onClose = null,
  onAction = null,
  actionText = null,
  className = '',
  showIcon = true,
  showProgress = true,
  persistent = false
}) => {
  // 자동 닫기 처리
  useEffect(() => {
    if (persistent || duration === 0) return;

    const timer = setTimeout(() => {
      onClose?.(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose, persistent]);

  // 진행률 계산
  const progress = showProgress && !persistent && duration > 0 ? 100 : 0;

  // 아이콘 선택
  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  // 타입별 CSS 클래스
  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      case 'info':
      default:
        return 'toast-info';
    }
  };

  // 위치별 CSS 클래스
  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'toast-top-left';
      case 'top-center':
        return 'toast-top-center';
      case 'top-right':
        return 'toast-top-right';
      case 'bottom-left':
        return 'toast-bottom-left';
      case 'bottom-center':
        return 'toast-bottom-center';
      case 'bottom-right':
        return 'toast-bottom-right';
      default:
        return 'toast-top-right';
    }
  };

  const handleClose = useCallback(() => {
    onClose?.(id);
  }, [id, onClose]);

  const handleAction = useCallback(() => {
    onAction?.(id);
    if (!persistent) {
      onClose?.(id);
    }
  }, [id, onAction, onClose, persistent]);

  return (
    <div 
      className={`toast ${getTypeClass()} ${getPositionClass()} ${className}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-content">
        {getIcon() && (
          <div className="toast-icon">
            {getIcon()}
          </div>
        )}
        
        <div className="toast-message">
          {message}
        </div>
        
        <div className="toast-actions">
          {actionText && onAction && (
            <button 
              className="toast-action-button"
              onClick={handleAction}
              type="button"
            >
              {actionText}
            </button>
          )}
          
          {!persistent && (
            <button 
              className="toast-close-button"
              onClick={handleClose}
              type="button"
              aria-label="닫기"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {showProgress && !persistent && duration > 0 && (
        <div className="toast-progress">
          <div 
            className="toast-progress-bar"
            style={{ 
              width: `${progress}%`,
              transition: `width ${duration}ms linear`
            }}
          />
        </div>
      )}
    </div>
  );
};

// PropTypes 정의
Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  position: PropTypes.oneOf([
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ]),
  onClose: PropTypes.func,
  onAction: PropTypes.func,
  actionText: PropTypes.string,
  className: PropTypes.string,
  showIcon: PropTypes.bool,
  showProgress: PropTypes.bool,
  persistent: PropTypes.bool
};

// 기본 Props
Toast.defaultProps = {
  type: 'info',
  duration: 5000,
  position: 'top-right',
  showIcon: true,
  showProgress: true,
  persistent: false
};

export default Toast;
