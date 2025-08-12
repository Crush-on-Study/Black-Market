import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import SignupModal from '../components/SignupModal';
import RotatingPartners from '../components/RotatingPartners';
import { Hyperspeed } from '../external';
import '../styles/pages/LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.email === 'test1@ekmtc.com' && formData.password === 'test1') {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 이메일에서 도메인 추출
        const domain = formData.email.split('@')[1];
        
        // 도메인에 따른 회사명 매핑
        let companyName = '';
        switch (domain) {
          case 'ekmtc.com':
            companyName = '고려해운';
            break;
          case 'tescom.com':
            companyName = '테스콤';
            break;
          case 'samsungcard.com':
            companyName = '삼성카드';
            break;
          default:
            companyName = 'Black Market';
        }
        
        // MainPage로 회사명과 도메인 정보 전달
        navigate('/main', { 
          state: { 
            companyName, 
            domain,
            userEmail: formData.email,
            nickname: 'test1' // 임시로 test1 닉네임 사용
          } 
        });
      } catch (error) {
        console.error('로그인 처리 중 오류:', error);
        setError('로그인 처리 중 오류가 발생했습니다.');
      }
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [formData.email, formData.password, navigate]);

  const openSignupModal = useCallback(() => {
    setIsSignupModalOpen(true);
  }, []);

  const closeSignupModal = useCallback(() => {
    setIsSignupModalOpen(false);
  }, []);

  return (
    <div className="login-container">
      {/* Hyperspeed 배경 */}
      <div className="hyperspeed-background-container">
        <Hyperspeed effectOptions={hyperspeedOptions} />
      </div>

      {/* 제휴 파트너사 표시 */}
      <RotatingPartners />

      {/* 로그인 창 오버레이 */}
      <div className="login-overlay">
        <Card variant="elevated" padding="xlarge" className="login-card">
          <div className="login-header">
            <h1>⚡ BLACK MARKET ⚡</h1>
            <p>암거래 시장에 오신 것을 환영합니다</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="이메일"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={isLoading}
              className={isLoading ? 'btn--loading' : ''}
            >
              {isLoading ? '접속 중...' : '시스템 접속'}
            </Button>
          </form>

          <div className="login-footer">
            <p>계정이 없으신가요? <button className="link-button" onClick={openSignupModal}>회원가입</button></p>
            <p><a href="/forgot-password">비밀번호를 잊으셨나요?</a></p>
            <div className="dev-info">
              <p><strong>개발용 계정:</strong> test1@ekmtc.com / test1</p>
            </div>
          </div>
        </Card>
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
