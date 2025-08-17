import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import '../styles/components/SellerModal.css';

const SellerModal = ({
  isOpen = false,
  seller = null,
  onClose = null,
  onContact = null,
  onReport = null,
  className = '',
  showContactButton = true,
  showReportButton = true,
  showRecentDeals = true,
  maxRecentDeals = 3
}) => {
  // 모달이 닫혀있거나 판매자 정보가 없으면 렌더링하지 않음
  if (!isOpen || !seller) {
    return null;
  }

  // 판매자 통계 계산 (메모이제이션)
  const sellerStats = useMemo(() => {
    return {
      totalDeals: seller.sellerDeals || 0,
      rating: seller.sellerRating || 0,
      completionRate: seller.completionRate || 95.2
    };
  }, [seller]);

  // 최근 거래 내역 (메모이제이션)
  const recentDeals = useMemo(() => {
    if (!showRecentDeals || !seller.recentDeals) return [];
    return seller.recentDeals.slice(0, maxRecentDeals);
  }, [seller.recentDeals, showRecentDeals, maxRecentDeals]);

  // 별점 표시 생성
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">⭐</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">⭐</span>);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleContact = () => {
    onContact?.(seller);
  };

  const handleReport = () => {
    onReport?.(seller);
  };

  return (
    <div className={`seller-modal-overlay ${className}`} onClick={handleOverlayClick}>
      <div className="seller-modal">
        <div className="modal-header">
          <h2>판매자 정보</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="seller-profile">
          <div className="seller-avatar">
            {seller.avatar || '👤'}
          </div>
          <div className="seller-basic-info">
            <h3>{seller.seller || '익명거래자'}</h3>
            <div className="seller-rating">
              <div className="stars">
                {renderStars(sellerStats.rating)}
              </div>
              <span className="rating-number">{sellerStats.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="seller-stats">
          <div className="stat-item">
            <span className="stat-label">총 거래</span>
            <span className="stat-value">{sellerStats.totalDeals}건</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">평점</span>
            <span className="stat-value">{sellerStats.rating.toFixed(1)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">완료율</span>
            <span className="stat-value">{sellerStats.completionRate}%</span>
          </div>
        </div>

        {showRecentDeals && recentDeals.length > 0 && (
          <div className="seller-recent-deals">
            <h4>최근 거래 내역</h4>
            <div className="recent-deals-list">
              {recentDeals.map((deal, index) => (
                <div key={deal.id || index} className="recent-deal-item">
                  <span className="deal-title">{deal.title}</span>
                  <span className="deal-status-mini">
                    {deal.status === 'completed' ? '✅' : '🔄'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-actions">
          {showContactButton && (
            <Button 
              variant="primary" 
              onClick={handleContact}
              className="contact-button"
            >
              연락하기
            </Button>
          )}
          
          {showReportButton && (
            <Button 
              variant="outline" 
              onClick={handleReport}
              className="report-button"
            >
              신고하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// PropTypes 정의
SellerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  seller: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    seller: PropTypes.string,
    avatar: PropTypes.string,
    sellerRating: PropTypes.number,
    sellerDeals: PropTypes.number,
    completionRate: PropTypes.number,
    recentDeals: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      status: PropTypes.oneOf(['completed', 'in_progress', 'cancelled'])
    }))
  }),
  onClose: PropTypes.func,
  onContact: PropTypes.func,
  onReport: PropTypes.func,
  className: PropTypes.string,
  showContactButton: PropTypes.bool,
  showReportButton: PropTypes.bool,
  showRecentDeals: PropTypes.bool,
  maxRecentDeals: PropTypes.number
};

// 기본 Props
SellerModal.defaultProps = {
  isOpen: false,
  showContactButton: true,
  showReportButton: true,
  showRecentDeals: true,
  maxRecentDeals: 3
};

export default SellerModal;
