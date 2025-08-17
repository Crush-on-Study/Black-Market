import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import Button from './Button';
import { useMainStore } from '../stores/mainStore';
import '../styles/components/PopularDeals.css';

const PopularDeals = ({ 
  isPageLoaded = false,
  onSellerClick,
  onTradeRequest,
  className = '',
  maxItems = 3,
  showRanking = true,
  showActions = true
}) => {
  const { deals } = useMainStore();
  
  // 인기글 TOP 3 계산 (메모이제이션)
  const popularDeals = useMemo(() => {
    return deals
      .filter(deal => deal.status === 'selling')
      .sort((a, b) => b.views - a.views)
      .slice(0, maxItems);
  }, [deals, maxItems]);

  // 데이터가 없을 때 처리
  if (!popularDeals.length) {
    return (
      <div className={`popular-deals ${className}`}>
        <h3>인기글 TOP {maxItems}</h3>
        <div className="no-deals-message">
          <p>현재 인기글을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`popular-deals ${className}`}>
      <h3>인기글 TOP {maxItems}</h3>
      <div className="popular-deals-grid">
        {popularDeals.map((deal, index) => (
          <Card 
            key={`popular-${deal.id}`} 
            variant="elevated" 
            className={`popular-deal-card ${isPageLoaded ? 'animate-in' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="popular-deal-header">
              {showRanking && (
                <span className="rank-badge">#{index + 1}</span>
              )}
              <div className="deal-type-badge">
                {deal.type === 'buy' ? '🟢 구매' : '🔴 판매'}
              </div>
              <h5 className="deal-title-truncate" title={deal.title}>
                {deal.title.length > 20 ? `${deal.title.substring(0, 20)}...` : deal.title}
              </h5>
            </div>
            <div className="popular-deal-info">
              <p><strong>조회수:</strong> {deal.views.toLocaleString()}회</p>
              <p><strong>가격:</strong> {deal.price.toLocaleString()}원</p>
              <p><strong>{deal.type === 'buy' ? '구매자' : '판매자'}:</strong> 
                <button 
                  className="seller-button-mini"
                  onClick={(e) => onSellerClick?.(deal, e)}
                  title={`${deal.seller} 정보 보기`}
                >
                  {deal.seller}
                </button>
              </p>
            </div>
            {showActions && (
              <div className="popular-deal-actions">
                <Button 
                  variant="primary" 
                  size="small" 
                  fullWidth
                  onClick={(e) => onTradeRequest?.(deal, e)}
                >
                  거래 신청
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// PropTypes 정의
PopularDeals.propTypes = {
  isPageLoaded: PropTypes.bool,
  onSellerClick: PropTypes.func,
  onTradeRequest: PropTypes.func,
  className: PropTypes.string,
  maxItems: PropTypes.number,
  showRanking: PropTypes.bool,
  showActions: PropTypes.bool
};

// 기본 Props
PopularDeals.defaultProps = {
  isPageLoaded: false,
  maxItems: 3,
  showRanking: true,
  showActions: true
};

export default PopularDeals;
