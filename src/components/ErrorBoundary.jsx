import React from 'react';
import '../styles/components/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 에러가 발생하면 상태를 업데이트하여 다음 렌더링에서 폴백 UI를 표시
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 정보를 로깅하거나 에러 리포팅 서비스에 전송
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // 에러가 발생했을 때 표시할 폴백 UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">문제가 발생했습니다</h1>
            <p className="error-message">
              예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>에러 상세 정보</summary>
                <pre className="error-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="error-actions">
              <button 
                className="error-button primary"
                onClick={() => window.location.reload()}
              >
                페이지 새로고침
              </button>
              <button 
                className="error-button secondary"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 정상적인 경우 자식 컴포넌트를 렌더링
    return this.props.children;
  }
}

export default ErrorBoundary;
