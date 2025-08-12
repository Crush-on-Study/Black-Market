import { useState } from 'react';
import Button from './Button';
import Card from './Card';
import Breadcrumb from './Breadcrumb';
import '../styles/components/BuyModal.css';

function BuyModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    points: '',
    maxPrice: '',
    description: '',
    urgency: 'normal'
  });

  const steps = [
    { id: 1, title: '구매 정보', description: '구매하고 싶은 포인트 정보를 입력하세요' },
    { id: 2, title: '가격 설정', description: '최대 구매 가격을 설정하세요' },
    { id: 3, title: '확인 및 등록', description: '정보를 확인하고 등록하세요' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    console.log('구매등록:', formData);
    alert('구매글이 등록되었습니다!');
    onClose();
    setCurrentStep(1);
    setFormData({
      title: '',
      points: '',
      maxPrice: '',
      description: '',
      urgency: 'normal'
    });
  };

  const calculatePricePerPoint = () => {
    if (formData.points && formData.maxPrice) {
      return (parseInt(formData.maxPrice) / parseInt(formData.points)).toFixed(2);
    }
    return 0;
  };

  if (!isOpen) return null;

  return (
    <div className="buy-modal-overlay" onClick={onClose}>
      <div className="buy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🟢 구매등록</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <Breadcrumb steps={steps} currentStep={currentStep} />

          {currentStep === 1 && (
            <div className="step-content">
              <h3>구매하고 싶은 포인트 정보</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">제목</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="예: 식권 포인트 80만점 구매 희망"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="points">필요한 포인트 수량</label>
                  <input
                    type="number"
                    id="points"
                    name="points"
                    value={formData.points}
                    onChange={handleInputChange}
                    placeholder="예: 800000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="urgency">긴급도</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                  >
                    <option value="low">낮음</option>
                    <option value="normal">보통</option>
                    <option value="high">높음</option>
                    <option value="urgent">긴급</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">상세 설명</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="구매하고 싶은 포인트에 대한 상세한 설명을 입력하세요..."
                    rows="4"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <h3>최대 구매 가격 설정</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="maxPrice">최대 구매 가격 (원)</label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={formData.maxPrice}
                    onChange={handleInputChange}
                    placeholder="예: 720000"
                    required
                  />
                </div>

                <div className="price-info">
                  <div className="info-item">
                    <span className="label">포인트당 최대 가격:</span>
                    <span className="value">₩{calculatePricePerPoint()}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">필요 포인트:</span>
                    <span className="value">{formData.points ? parseInt(formData.points).toLocaleString() : 0}점</span>
                  </div>
                  <div className="info-item">
                    <span className="label">최대 총 가격:</span>
                    <span className="value">₩{formData.maxPrice ? parseInt(formData.maxPrice).toLocaleString() : 0}</span>
                  </div>
                </div>

                <div className="urgency-info">
                  <div className="urgency-badge">
                    <span className="urgency-label">긴급도:</span>
                    <span className={`urgency-value ${formData.urgency}`}>
                      {formData.urgency === 'low' && '🟢 낮음'}
                      {formData.urgency === 'normal' && '🟡 보통'}
                      {formData.urgency === 'high' && '🟠 높음'}
                      {formData.urgency === 'urgent' && '🔴 긴급'}
                    </span>
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
                  <span className="label">필요 포인트:</span>
                  <span className="value">{formData.points ? parseInt(formData.points).toLocaleString() : 0}점</span>
                </div>
                <div className="summary-item">
                  <span className="label">최대 가격:</span>
                  <span className="value">₩{formData.maxPrice ? parseInt(formData.maxPrice).toLocaleString() : 0}</span>
                </div>
                <div className="summary-item">
                  <span className="label">포인트당 최대 가격:</span>
                  <span className="value">₩{calculatePricePerPoint()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">긴급도:</span>
                  <span className="value">
                    {formData.urgency === 'low' && '🟢 낮음'}
                    {formData.urgency === 'normal' && '🟡 보통'}
                    {formData.urgency === 'high' && '🟠 높음'}
                    {formData.urgency === 'urgent' && '🔴 긴급'}
                  </span>
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
                구매등록
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyModal;
