import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import Button from './Button';
import { recentTradesData } from '../data/mockData';
import '../styles/components/RecentTrades.css';

const RecentTrades = ({
  className = '',
  maxItems = 5,
  showHeader = true,
  showViewAllButton = true,
  data = null,
  onTradeClick = null,
  onViewAllClick = null
}) => {
  const trades = data || recentTradesData;
  
  // 최근 거래 내역 계산 (메모이제이션)
  const recentTrades = useMemo(() => {
    return trades.slice(0, maxItems);
  }, [trades, maxItems]);

  // 데이터가 없을 때 처리
  if (!recentTrades || recentTrades.length === 0) {
    return (
      <Card variant="elevated" className={`recent-trades-card ${className}`}>
        {showHeader && (
          <div className="card-header">
            <h3>🔄 최근 거래 내역</h3>
          </div>
        )}
        <div className="no-trades-message">
          <p>최근 거래 내역을 불러올 수 없습니다.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className={`recent-trades-card ${className}`}>
      {showHeader && (
        <div className="card-header">
          <h3>🔄 최근 거래 내역</h3>
          {showViewAllButton && (
            <Button 
              variant="secondary" 
              size="small"
              onClick={onViewAllClick}
            >
              전체보기
            </Button>
          )}
        </div>
      )}
      
      <div className="recent-trades">
        {recentTrades.map((trade) => (
          <div 
            key={trade.id} 
            className={`trade-item ${trade.type}`}
            onClick={() => onTradeClick?.(trade)}
            style={{ cursor: onTradeClick ? 'pointer' : 'default' }}
          >
            <div className="trade-type">
              <span className={`trade-icon ${trade.type}`}>
                {trade.type === 'buy' ? '📥' : '📤'}
              </span>
              <span className="trade-user">{trade.user}</span>
            </div>
            <div className="trade-details">
              <span className="trade-points">{trade.points}</span>
              <span className="trade-price">{trade.price}</span>
            </div>
            <div className="trade-time">{trade.time}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// PropTypes 정의
RecentTrades.propTypes = {
  className: PropTypes.string,
  maxItems: PropTypes.number,
  showHeader: PropTypes.bool,
  showViewAllButton: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['buy', 'sell']).isRequired,
    user: PropTypes.string.isRequired,
    points: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  })),
  onTradeClick: PropTypes.func,
  onViewAllClick: PropTypes.func
};

// 기본 Props
RecentTrades.defaultProps = {
  maxItems: 5,
  showHeader: true,
  showViewAllButton: true
};

export default RecentTrades;
