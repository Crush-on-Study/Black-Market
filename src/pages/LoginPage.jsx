import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import SignupModal from '../components/SignupModal';
import { Hyperspeed } from '../external';
import { companyDomainMap, defaultCompanyName } from '../data/mockData';
import '../styles/pages/LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lastLoginTime, setLastLoginTime] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  
  // Progressive Disclosure Pattern 상태
  const [currentStep, setCurrentStep] = useState('email');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showRememberMe, setShowRememberMe] = useState(false);
  
  const navigate = useNavigate();

  // 마지막 로그인 시간 표시
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lastLoginTime');
      if (stored) {
        setLastLoginTime(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('마지막 로그인 시간 복원 실패:', error);
    }
  }, []);

  // 로그인 시도 제한 체크
  useEffect(() => {
    try {
      const stored = localStorage.getItem('loginAttempts');
      if (stored) {
        const data = JSON.parse(stored);
        const now = Date.now();
        
        if (data.lockoutUntil && now < data.lockoutUntil) {
          setIsLocked(true);
          setLockoutUntil(data.lockoutUntil);
        } else if (data.lockoutUntil && now >= data.lockoutUntil) {
          resetLoginAttempts();
        } else {
          setLoginAttempts(data.attempts || 0);
        }
      }
    } catch (error) {
      console.warn('로그인 시도 기록 복원 실패:', error);
    }
  }, []);

  // Hyperspeed 옵션을 useMemo로 메모이제이션
  const hyperspeedOptions = useMemo(() => ({
    onSpeedUp: () => { },
    onSlowDown: () => { },
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 75,
    fovSpeedUp: 100,
    speedUp: 1.2,
    carLightsFade: 0.6,
    totalSideLightSticks: 15,
    lightPairsPerRoadWay: 25,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [30, 50],
    movingCloserSpeed: [-60, -80],
    carLightsLength: [400 * 0.02, 400 * 0.15],
    carLightsRadius: [0.03, 0.1],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xFFFFFF,
      brokenLines: 0xFFFFFF,
      leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
      rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
      sticks: 0x03B3C3,
    }
  }), []);

  // Hyperspeed 컴포넌트를 useMemo로 메모이제이션
  const memoizedHyperspeed = useMemo(() => (
    <Hyperspeed options={hyperspeedOptions} />
  ), [hyperspeedOptions]);

  // 로그인 시도 기록 초기화
  const resetLoginAttempts = useCallback(() => {
    setLoginAttempts(0);
    setIsLocked(false);
    setLockoutUntil(null);
    localStorage.removeItem('loginAttempts');
  }, []);

  // 로그인 시도 기록
  const recordLoginAttempt = useCallback((success = false) => {
    if (success) {
      resetLoginAttempts();
      return;
    }

    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    if (newAttempts >= 5) {
      const lockoutTime = Date.now() + (15 * 60 * 1000);
      setIsLocked(true);
      setLockoutUntil(lockoutTime);
      
      localStorage.setItem('loginAttempts', JSON.stringify({
        attempts: newAttempts,
        lockoutUntil: lockoutTime
      }));
    } else {
      localStorage.setItem('loginAttempts', JSON.stringify({
        attempts: newAttempts,
        lockoutUntil: null
      }));
    }
  }, [loginAttempts, resetLoginAttempts]);

  // 이메일 유효성 검사
  const validateEmail = useCallback((email) => {
    if (!email) {
      return '이메일을 입력해주세요.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return '올바른 이메일 형식을 입력해주세요.';
    }
    const domain = email.split('@')[1];
    if (!companyDomainMap[domain]) {
      return '지원하지 않는 회사 도메인입니다.';
    }
    return null;
  }, []);

  // 비밀번호 유효성 검사
  const validatePassword = useCallback((password) => {
    if (!password) {
      return '비밀번호를 입력해주세요.';
    }
    if (password.length < 4) {
      return '비밀번호는 최소 4자 이상이어야 합니다.';
    }
    return null;
  }, []);

  // 입력 필드 변경 처리
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [errors]);

  // 이메일 입력 완료 처리
  const handleEmailComplete = useCallback(() => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setCurrentStep('password');
    setShowPasswordField(true);
    
    setTimeout(() => {
      const passwordInput = document.querySelector('input[name="password"]');
      if (passwordInput) {
        passwordInput.focus();
      }
    }, 300);
  }, [formData.email, validateEmail]);

  // 비밀번호 입력 완료 처리
  const handlePasswordComplete = useCallback(() => {
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    setCurrentStep('complete');
    setShowRememberMe(true);
  }, [formData.password, validatePassword]);

  // 체크박스 변경 처리
  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    if (name === 'rememberMe') {
      setRememberMe(checked);
    }
  }, []);

  // 비밀번호 표시/숨김 토글
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // 로그인 제출 처리
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      const remainingTime = Math.ceil((lockoutUntil - Date.now()) / (60 * 1000));
      setErrors({ general: `로그인이 잠겼습니다. ${remainingTime}분 후에 다시 시도해주세요.` });
      return;
    }

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);

    try {
      if (formData.email === 'test1@ekmtc.com' && formData.password === 'test1') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        recordLoginAttempt(true);
        
        const now = new Date();
        setLastLoginTime(now);
        try {
          localStorage.setItem('lastLoginTime', JSON.stringify(now));
        } catch (error) {
          console.warn('마지막 로그인 시간 저장 실패:', error);
        }
        
        const domain = formData.email.split('@')[1];
        const companyName = companyDomainMap[domain] || defaultCompanyName;
        
        navigate('/main', { 
          state: { 
            companyName, 
            domain,
            userEmail: formData.email,
            nickname: 'test1',
            rememberMe,
            sessionStartTime: Date.now()
          } 
        });
      } else {
        recordLoginAttempt(false);
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [formData.email, formData.password, navigate, rememberMe, validateEmail, validatePassword, recordLoginAttempt, isLocked, lockoutUntil]);

  // 회원가입 모달 열기
  const openSignupModal = useCallback(() => {
    setIsSignupModalOpen(true);
  }, []);

  // 회원가입 모달 닫기
  const closeSignupModal = useCallback(() => {
    setIsSignupModalOpen(false);
  }, []);

  // 비밀번호 찾기 페이지로 이동
  const handleForgotPassword = useCallback((e) => {
    e.preventDefault();
    alert('비밀번호 찾기 기능은 아직 준비 중입니다.');
  }, []);

  // 개발용 계정 정보 표시
  const showDevInfo = process.env.NODE_ENV === 'development';

  // 마지막 로그인 시간 포맷팅
  const formatLastLoginTime = useCallback((time) => {
    if (!time) return null;
    
    const now = new Date();
    const loginTime = new Date(time);
    const diffMs = now - loginTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}일 전`;
    } else if (diffHours > 0) {
      return `${diffHours}시간 전`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}분 전`;
    }
  }, []);

  return (
    <div className="login-container">
      {/* Hyperspeed 배경 */}
      <div className="hyperspeed-background-container">
        {memoizedHyperspeed}
      </div>

      {/* 로그인 창 오버레이 */}
      <div className="login-overlay">
        <div className="login-card-container">
          {/* 왼쪽 브랜딩 섹션 */}
          <div className="login-brand-section">
            <div className="brand-content">
              <div className="brand-logo">
                <div className="logo-icon">⚡</div>
                <h1 className="brand-title">BLACK MARKET</h1>
              </div>
              <p className="brand-subtitle">암거래 시장에 오신 것을 환영합니다</p>
              <div className="brand-features">
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span className="feature-text">P2P 거래</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span className="feature-text">실시간 채팅</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💎</span>
                  <span className="feature-text">게임화 환경</span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 로그인 폼 섹션 */}
          <div className="login-form-section">
            <div className="form-container">
              <div className="form-header">
                <h2>시스템 접속</h2>
                <p>회사 계정으로 로그인하세요</p>
              </div>

              {/* 마지막 로그인 시간 표시 */}
              {lastLoginTime && (
                <div className="last-login-info">
                  <span className="last-login-icon">🕒</span>
                  <span>마지막 로그인: {formatLastLoginTime(lastLoginTime)}</span>
                </div>
              )}

              {/* 로그인 시도 제한 경고 */}
              {loginAttempts > 0 && !isLocked && (
                <div className="login-attempts-warning">
                  <span className="warning-icon">⚠️</span>
                  <div className="warning-content">
                    <span>로그인 시도 {loginAttempts}/5</span>
                    <span>남은 시도: {5 - loginAttempts}회</span>
                  </div>
                </div>
              )}

              {/* 로그인 잠금 상태 */}
              {isLocked && (
                <div className="login-locked-warning">
                  <span className="lock-icon">🔒</span>
                  <div className="lock-content">
                    <span>로그인이 잠겼습니다</span>
                    <span>{Math.ceil((lockoutUntil - Date.now()) / (60 * 1000))}분 후에 다시 시도해주세요</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form" noValidate>
                {/* 이메일 입력 단계 */}
                <div className={`form-step ${currentStep === 'email' ? 'active' : ''}`}>
                  <div className="input-group">
                    <label className="input-label">
                      <span className="label-icon">📧</span>
                      회사 이메일
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="회사 이메일을 입력하세요"
                      required
                      error={errors.email}
                      autoComplete="email"
                      autoFocus
                      disabled={isLocked}
                      className="modern-input"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handleEmailComplete}
                    disabled={!formData.email.trim() || isLocked}
                    className="next-step-button"
                  >
                    다음 단계
                  </Button>
                </div>

                {/* 비밀번호 입력 단계 */}
                {showPasswordField && (
                  <div className={`form-step ${currentStep === 'password' ? 'active' : ''}`}>
                    <div className="input-group">
                      <label className="input-label">
                        <span className="label-icon">🔐</span>
                        비밀번호
                      </label>
                      <div className="password-input-container">
                        <Input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="비밀번호를 입력하세요"
                          required
                          error={errors.password}
                          autoComplete="current-password"
                          disabled={isLocked}
                          className="modern-input"
                        />
                        <button
                          type="button"
                          className="password-toggle-button"
                          onClick={togglePasswordVisibility}
                          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                          disabled={isLocked}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="primary"
                      size="large"
                      fullWidth
                      onClick={handlePasswordComplete}
                      disabled={!formData.password.trim() || isLocked}
                      className="next-step-button"
                    >
                      다음 단계
                    </Button>
                  </div>
                )}

                {/* 추가 옵션 단계 */}
                {showRememberMe && (
                  <div className={`form-step ${currentStep === 'complete' ? 'active' : ''}`}>
                    <div className="form-options">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={rememberMe}
                          onChange={handleCheckboxChange}
                          disabled={isLocked}
                        />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">로그인 상태 유지</span>
                      </label>
                    </div>

                    {errors.general && (
                      <div className="error-message general-error">
                        <span className="error-icon">❌</span>
                        {errors.general}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      fullWidth
                      disabled={isLoading || isLocked}
                      className={`login-submit-button ${isLoading ? 'btn--loading' : ''}`}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading-spinner"></span>
                          접속 중...
                        </>
                      ) : (
                        <>
                          <span className="button-icon">🚀</span>
                          시스템 접속
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </form>

              <div className="form-footer">
                <div className="footer-links">
                  <button 
                    type="button"
                    className="footer-link" 
                    onClick={openSignupModal}
                  >
                    회원가입
                  </button>
                  <span className="link-separator">•</span>
                  <button 
                    type="button"
                    className="footer-link" 
                    onClick={handleForgotPassword}
                  >
                    비밀번호 찾기
                  </button>
                </div>
                
                {showDevInfo && (
                  <div className="dev-info">
                    <div className="dev-info-header">
                      <span className="dev-icon">🛠️</span>
                      <span>개발용 계정</span>
                    </div>
                    <div className="dev-credentials">
                      <div className="credential-item">
                        <span className="credential-label">이메일:</span>
                        <span className="credential-value">test1@ekmtc.com</span>
                      </div>
                      <div className="credential-item">
                        <span className="credential-label">비밀번호:</span>
                        <span className="credential-value">test1</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 회원가입 모달 */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
      />
    </div>
  );
}

export default LoginPage;
