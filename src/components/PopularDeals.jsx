import { useMainStore } from '../stores/mainStore';
import Button from './Button';
import Card from './Card';
import '../styles/components/PopularDeals.css';

const PopularDeals = ({ isPageLoaded, onSellerClick, onTradeRequest }) => {
  const { deals } = useMainStore();

  const popularDeals = deals
    .filter(deal => deal.status === 'selling')
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  return (
    <div className="popular-deals">
      <div className="popular-deals-grid">
        {popularDeals.map((deal, index) => (
          <Card 
            key={`popular-${deal.id}`} 
            variant="elevated" 
            className={`popular-deal-card ${isPageLoaded ? 'animate-in' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="popular-deal-header">
              <span className="rank-badge">#{index + 1}</span>
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
                  onClick={(e) => onSellerClick(deal, e)}
                  title={`${deal.seller} 정보 보기`}
                >
                  {deal.seller}
                </button>
              </p>
            </div>
            <div className="popular-deal-actions">
              <Button 
                variant="primary" 
                size="small" 
                fullWidth
                onClick={(e) => onTradeRequest(deal, e)}
              >
                거래 신청
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PopularDeals;
