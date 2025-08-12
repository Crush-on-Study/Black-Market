import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import SearchableSelect from './SearchableSelect';
import Breadcrumb from './Breadcrumb';
import '../styles/components/SignupModal.css';

function SignupModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    name: '',
    nickname: '',
    verificationCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState(''); // 'available', 'taken', ''

  const navigate = useNavigate();

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData({
        company: '',
        email: '',
        name: '',
        nickname: '',
        verificationCode: ''
      });
      setError('');
      setIsLoading(false);
      setIsVerificationSent(false);
    }
  }, [isOpen]);

  // 회사 목록 (icon 필드와 도메인 추가)
  const companies = [
    { id: 'korea', name: '고려해운', description: '해운 및 물류 서비스', icon: '🚢', domain: 'ekmtc.com' },
    { id: 'tescom', name: '테스콤', description: '전자 및 통신 기술', icon: '🔌', domain: 'tescom.com' },
    { id: 'samsungcard', name: '삼성카드', description: '금융 및 신용카드 서비스', icon: '💳', domain: 'samsungcard.com' }
  ];

  // 브레드크럼 단계 (5단계로 변경 - 닉네임 추가)
  const steps = [
    { id: 1, title: '회사 선택', description: '소속 회사를 선택해주세요' },
    { id: 2, title: '기본 정보', description: '이름과 회사이메일계정을 입력해주세요' },
    { id: 3, title: '닉네임 설정', description: '사용할 닉네임을 입력해주세요' },
    { id: 4, title: '이메일 인증', description: '인증코드를 입력해주세요' },
    { id: 5, title: '가입 완료', description: '회원가입이 완료되었습니다' }
  ];

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  }, [error]);

  const handleCompanySelect = useCallback((companyId) => {
    setFormData(prev => ({ ...prev, company: companyId }));
    setCurrentStep(2);
  }, []);

  const handleRequestCompany = useCallback(() => {
    // 관리자에게 회사 추가 요청
    setError('회사 추가 요청이 관리자에게 전송되었습니다. 승인 후 가입이 가능합니다.');
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep === 2) {
      // 기본 정보 검증
      if (!formData.name || !formData.email) {
        setError('이름과 회사이메일계정을 모두 입력해주세요.');
        return;
      }
      
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('올바른 이메일 형식을 입력해주세요.');
        return;
      }
      
      // 회사 도메인 검증
      const selectedCompany = companies.find(c => c.id === formData.company);
      if (selectedCompany) {
        const emailDomain = formData.email.split('@')[1];
        if (emailDomain !== selectedCompany.domain) {
          setError(`${selectedCompany.name}의 공식 도메인(${selectedCompany.domain})을 사용해주세요.`);
          return;
        }
      }
      
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // 닉네임 중복 검사
      if (!formData.nickname) {
        setError('닉네임을 입력해주세요.');
        return;
      }
      setIsCheckingNickname(true);
      // 임시로 2초 대기 (실제로는 백엔드 API 호출)
      setTimeout(() => {
        setIsCheckingNickname(false);
        // 임시로 닉네임 중복 검사 로직
        if (formData.nickname === 'test') {
          setNicknameStatus('taken');
          setError('이미 사용 중인 닉네임입니다.');
        } else {
          setNicknameStatus('available');
          setError('');
        }
      }, 2000);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // 인증코드 검증
      if (!formData.verificationCode) {
        setError('인증코드를 입력해주세요.');
        return;
      }
      // 임시로 111111만 허용
      if (formData.verificationCode !== '111111') {
        setError('인증코드가 올바르지 않습니다. (임시: 111111)');
        return;
      }
      setCurrentStep(5);
    }
  }, [currentStep, formData, companies]);

  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSendVerification = useCallback(async () => {
    if (!formData.email) {
      setError('이메일을 먼저 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    try {
      // 임시로 2초 대기 (실제로는 백엔드 API 호출)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsVerificationSent(true);
      setError('');
      // 성공 메시지 표시
      setTimeout(() => {
        setError('인증코드가 이메일로 전송되었습니다. (임시: 111111)');
      }, 100);
      
    } catch (error) {
      setError('인증코드 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [formData.email]);

  // 회원가입 완료 후 모달 닫기 (별도 함수) - handleSubmit보다 먼저 정의
  const handleCompleteClose = useCallback(() => {
    // 모든 상태 초기화
    setCurrentStep(1);
    setFormData({
      company: '',
      email: '',
      name: '',
      nickname: '',
      verificationCode: ''
    });
    setError('');
    setIsLoading(false);
    setIsVerificationSent(false);
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      // 회원가입 처리 (실제로는 백엔드 API 호출)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 성공 시 모달 닫기
      setTimeout(() => {
        handleCompleteClose();
        // 로그인 페이지로 이동
        navigate('/login');
      }, 1500);
    } catch (error) {
      setError('회원가입 처리 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  }, [handleCompleteClose, navigate]);

  const handleClose = useCallback(() => {
    // 모달 닫기 시 상태 초기화
    setCurrentStep(1);
    setFormData({
      company: '',
      email: '',
      name: '',
      nickname: '',
      verificationCode: ''
    });
    setError('');
    setIsLoading(false);
    setIsVerificationSent(false);
    onClose();
  }, [onClose]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>소속 회사를 선택해주세요</h2>
            <p className="step-description">
              Black Market 서비스 이용을 위해 소속 회사를 선택해주세요.
            </p>
            
            <div className="company-selection">
              <SearchableSelect
                options={companies}
                value={formData.company}
                onChange={handleCompanySelect}
                placeholder="회사를 선택해주세요"
                searchPlaceholder="회사명이나 설명으로 검색하세요"
              />
            </div>
            
            <div className="company-request">
              <p>본인 회사가 목록에 없나요?</p>
              <Button
                variant="secondary"
                size="medium"
                onClick={handleRequestCompany}
              >
                회사 추가 요청
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>기본 정보를 입력해주세요</h2>
            <p className="step-description">
              회사 인증을 위한 기본 정보를 입력해주세요.
            </p>
            
            <div className="form-grid">
              <Input
                label="이름"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="실명을 입력해주세요"
                required
              />
              
              <Input
                label="회사이메일계정"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="회사 이메일을 입력해주세요"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>닉네임을 설정해주세요</h2>
            <p className="step-description">
              사용하실 닉네임을 입력해주세요. 닉네임은 변경이 불가합니다.
            </p>
            
            <div className="form-grid">
              <Input
                label="닉네임"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="예: BlackMarketUser"
                required
                disabled={isCheckingNickname}
              />
              {isCheckingNickname && (
                <p className="nickname-status">닉네임 중복 검사 중...</p>
              )}
              {nicknameStatus === 'available' && (
                <p className="nickname-status success">사용 가능한 닉네임입니다.</p>
              )}
              {nicknameStatus === 'taken' && (
                <p className="nickname-status error">이미 사용 중인 닉네임입니다.</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>이메일 인증</h2>
            <p className="step-description">
              입력하신 이메일로 인증코드가 전송되었습니다.
            </p>
            
            <div className="verification-info">
              <p className="email-display">
                <strong>전송된 이메일:</strong> {formData.email}
              </p>
              <p className="verification-note">
                📧 인증코드를 확인하여 입력해주세요
              </p>
            </div>
            
            <div className="form-grid">
              <div className="verification-input-group">
                <Input
                  label="인증코드"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  placeholder="6자리 인증코드를 입력해주세요"
                  required
                />
                <div className="verification-actions">
                  {!isVerificationSent ? (
                    <Button
                      variant="secondary"
                      size="medium"
                      onClick={handleSendVerification}
                      disabled={isLoading}
                    >
                      {isLoading ? '전송 중...' : '인증코드 전송'}
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="medium"
                      onClick={handleSendVerification}
                      disabled={isLoading}
                    >
                      {isLoading ? '재전송 중...' : '인증코드 재전송'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="verification-help">
              <p>💡 <strong>임시 인증코드:</strong> 111111</p>
              <p>📱 이메일을 확인할 수 없나요? 스팸함도 확인해보세요.</p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <div className="success-content">
              <div className="success-icon">✅</div>
              <h2>회원가입이 완료되었습니다!</h2>
              <p className="success-description">
                {companies.find(c => c.id === formData.company)?.name} 소속으로 가입이 완료되었습니다.
              </p>
              <p className="success-info">
                관리자 승인 후 서비스 이용이 가능합니다.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="signup-modal-overlay" onClick={handleClose}>
      <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h1>⚡ BLACK MARKET 회원가입 ⚡</h1>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* 브레드크럼 네비게이션 */}
        <Breadcrumb steps={steps} currentStep={currentStep} />

        {/* 단계별 콘텐츠 */}
        {renderStepContent()}

        {/* 에러 메시지 */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* 네비게이션 버튼 */}
        {currentStep < 5 && (
          <div className="step-navigation">
            {currentStep > 1 && (
              <Button
                variant="secondary"
                size="large"
                onClick={handlePrev}
                disabled={isLoading}
              >
                이전
              </Button>
            )}
            
            {currentStep === 2 && (
              <Button
                variant="primary"
                size="large"
                onClick={handleNext}
                disabled={isLoading}
              >
                다음
              </Button>
            )}
            
            {currentStep === 3 && (
              <Button
                variant="primary"
                size="large"
                onClick={handleNext}
                disabled={isLoading}
              >
                닉네임 설정
              </Button>
            )}

            {currentStep === 4 && (
              <Button
                variant="primary"
                size="large"
                onClick={handleNext}
                disabled={isLoading}
              >
                인증 완료
              </Button>
            )}
          </div>
        )}

        {/* 가입 완료 버튼 */}
        {currentStep === 5 && (
          <div className="step-navigation">
            <Button
              variant="primary"
              size="large"
              onClick={handleSubmit}
              disabled={isLoading}
              className={isLoading ? 'btn--loading' : ''}
              fullWidth
            >
              {isLoading ? '가입 처리 중...' : '회원가입 완료'}
            </Button>
          </div>
        )}

        {/* 모달 푸터 */}
        <div className="modal-footer">
          <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
        </div>
      </div>
    </div>
  );
}

export default SignupModal;
