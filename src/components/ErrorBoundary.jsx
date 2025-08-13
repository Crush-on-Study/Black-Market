import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import '../styles/components/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // 에러가 발생하면 상태를 업데이트
    return {
      hasError: true,
      errorId: Date.now() // 에러 ID 생성
    };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 정보를 상태에 저장
    this.setState({
      error,
      errorInfo
    });

    // 에러 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // 프로덕션에서는 에러 추적 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // 에러 추적 서비스로 전송하는 로직
    // 예: Sentry, LogRocket 등
    try {
      // 실제 에러 추적 서비스 연동 시 여기에 구현
      console.warn('Error tracking service not configured');
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo, errorId } = this.state;
    const { 
      children, 
      fallback: FallbackComponent,
      showErrorDetails = false,
      showRetryButton = true,
      showReloadButton = true,
      showHomeButton = true,
      className = ''
    } = this.props;

    if (hasError) {
      // 커스텀 Fallback 컴포넌트가 있으면 사용
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            errorInfo={errorInfo}
            errorId={errorId}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
            onGoHome={this.handleGoHome}
          />
        );
      }

      // 기본 에러 UI
      return (
        <div className={`error-boundary ${className}`}>
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">예상치 못한 오류가 발생했습니다</h2>
            <p className="error-message">
              죄송합니다. 문제가 발생했습니다. 다시 시도해 주세요.
            </p>
            
            {showErrorDetails && process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>에러 상세 정보 (개발자용)</summary>
                <div className="error-stack">
                  <h4>에러:</h4>
                  <pre>{error?.toString()}</pre>
                  <h4>스택 트레이스:</h4>
                  <pre>{errorInfo?.componentStack}</pre>
                  <h4>에러 ID:</h4>
                  <p>{errorId}</p>
                </div>
              </details>
            )}

            <div className="error-actions">
              {showRetryButton && (
                <Button 
                  variant="primary" 
                  onClick={this.handleRetry}
                  className="error-button primary"
                >
                  다시 시도
                </Button>
              )}
              
              {showReloadButton && (
                <Button 
                  variant="secondary" 
                  onClick={this.handleReload}
                  className="error-button secondary"
                >
                  페이지 새로고침
                </Button>
              )}
              
              {showHomeButton && (
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="error-button outline"
                >
                  홈으로 이동
                </Button>
              )}
            </div>

            <div className="error-help">
              <p>
                문제가 지속되면 관리자에게 문의해 주세요.<br />
                에러 ID: <code>{errorId}</code>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// PropTypes 정의
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.elementType,
  showErrorDetails: PropTypes.bool,
  showRetryButton: PropTypes.bool,
  showReloadButton: PropTypes.bool,
  showHomeButton: PropTypes.bool,
  className: PropTypes.string
};

// 기본 Props
ErrorBoundary.defaultProps = {
  showErrorDetails: false,
  showRetryButton: true,
  showReloadButton: true,
  showHomeButton: true
};

export default ErrorBoundary;
