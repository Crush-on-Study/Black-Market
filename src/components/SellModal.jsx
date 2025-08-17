import { useState } from 'react';
import Button from './Button';
import Card from './Card';
import Breadcrumb from './Breadcrumb';
import DropdownSelect from './DropdownSelect';
import { useToast } from '../contexts/ToastContext';
import '../styles/components/SellModal.css';

function SellModal({ isOpen, onClose }) {
  const { showSuccessToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    points: '',
    price: '',
    description: '',
    expiryDays: 7
  });

  // 유효기간 옵션
  const expiryOptions = [
    { value: 3, label: '3일' },
    { value: 7, label: '7일' },
    { value: 14, label: '14일' },
    { value: 30, label: '30일' }
  ];

  const steps = [
    { id: 1, title: '판매 정보', description: '판매할 포인트 정보를 입력하세요' },
    { id: 2, title: '가격 설정', description: '판매 가격을 설정하세요' },
    { id: 3, title: '확인 및 등록', description: '정보를 확인하고 등록하세요' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpiryChange = (option) => {
    setFormData(prev => ({
      ...prev,
      expiryDays: option.value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // 여기에 실제 등록 로직 구현
    // TODO: 실제 API 호출 로직 구현
    showSuccessToast('판매글이 등록되었습니다!');
    onClose();
    setCurrentStep(1);
    setFormData({
      title: '',
      points: '',
      price: '',
      description: '',
      expiryDays: 7
    });
  };

  const calculatePricePerPoint = () => {
    if (formData.points && formData.price) {
      return (parseInt(formData.price) / parseInt(formData.points)).toFixed(2);
    }
    return 0;
  };

  if (!isOpen) return null;

  return (
    <div className="sell-modal-overlay" onClick={onClose}>
      <div className="sell-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔴 판매등록</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <Breadcrumb steps={steps} currentStep={currentStep} />

          {currentStep === 1 && (
            <div className="step-content">
              <h3>판매할 포인트 정보</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">제목</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="예: 고급 식권 포인트 50만점"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="points">포인트 수량</label>
                  <input
                    type="number"
                    id="points"
                    name="points"
                    value={formData.points}
                    onChange={handleInputChange}
                    placeholder="예: 500000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expiryDays">유효기간 (일)</label>
                  <DropdownSelect
                    options={expiryOptions}
                    value={expiryOptions.find(option => option.value === formData.expiryDays)}
                    onChange={handleExpiryChange}
                    placeholder="선택"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">상세 설명</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="포인트에 대한 상세한 설명을 입력하세요..."
                    rows="4"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <h3>판매 가격 설정</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="price">판매 가격 (원)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="예: 450000"
                    required
                  />
                </div>

                <div className="price-info">
                  <div className="info-item">
                    <span className="label">포인트당 가격:</span>
                    <span className="value">₩{calculatePricePerPoint()}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">총 포인트:</span>
                    <span className="value">{formData.points ? parseInt(formData.points).toLocaleString() : 0}점</span>
                  </div>
                  <div className="info-item">
                    <span className="label">총 가격:</span>
                    <span className="value">₩{formData.price ? parseInt(formData.price).toLocaleString() : 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content">
              <h3>등록 정보 확인</h3>
              <div className="confirmation-summary">
                <div className="summary-item">
                  <span className="label">제목:</span>
                  <span className="value">{formData.title}</span>
                </div>
                <div className="summary-item">
                  <span className="label">포인트:</span>
                  <span className="value">{formData.points ? parseInt(formData.points).toLocaleString() : 0}점</span>
                </div>
                <div className="summary-item">
                  <span className="label">가격:</span>
                  <span className="value">₩{formData.price ? parseInt(formData.price).toLocaleString() : 0}</span>
                </div>
                <div className="summary-item">
                  <span className="label">포인트당 가격:</span>
                  <span className="value">₩{calculatePricePerPoint()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">유효기간:</span>
                  <span className="value">{formData.expiryDays}일</span>
                </div>
                <div className="summary-item">
                  <span className="label">상세설명:</span>
                  <span className="value">{formData.description || '없음'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="step-navigation">
            {currentStep > 1 && (
              <Button variant="secondary" size="medium" onClick={handlePrev}>
                이전
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button variant="primary" size="medium" onClick={handleNext}>
                다음
              </Button>
            ) : (
              <Button variant="primary" size="medium" onClick={handleSubmit}>
                판매등록
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellModal;
