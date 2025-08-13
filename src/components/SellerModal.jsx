import { useMainStore } from '../stores/mainStore';
import Button from './Button';
import '../styles/components/SellerModal.css';

const SellerModal = ({ isOpen, seller, onClose }) => {
  const { deals } = useMainStore();

  if (!isOpen || !seller) return null;

  const sellerDeals = deals.filter(d => d.seller === seller.seller);

  return (
    <div className="seller-modal-overlay" onClick={onClose}>
      <div className="seller-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👤 판매자 정보</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="seller-profile">
          <div className="seller-avatar">👤</div>
          <div className="seller-basic-info">
            <h3>{seller.seller}</h3>
            <div className="seller-rating">
              <span className="stars">{'⭐'.repeat(Math.floor(seller.sellerRating))}</span>
              <span className="rating-number">{seller.sellerRating}</span>
            </div>
          </div>
        </div>
        
        <div className="seller-stats">
          <div className="stat-item">
            <span className="stat-label">총 거래 건수</span>
            <span className="stat-value">{seller.sellerDeals}건</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">평균 평점</span>
            <span className="stat-value">{seller.sellerRating}/5.0</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">현재 판매글</span>
            <span className="stat-value">{sellerDeals.filter(d => d.status === 'selling').length}건</span>
          </div>
        </div>
        
        <div className="seller-recent-deals">
          <h4>최근 거래 내역</h4>
          <div className="recent-deals-list">
            {sellerDeals
              .slice(0, 3)
              .map((deal) => (
                <div key={deal.id} className="recent-deal-item">
                  <span className="deal-title">{deal.title}</span>
                  <span className="deal-status-mini">
                    {deal.status === 'selling' ? '🟢' : '🔴'}
                  </span>
                </div>
              ))}
          </div>
        </div>
        
        <div className="modal-actions">
          <Button variant="secondary" size="medium" onClick={onClose}>
            닫기
          </Button>
          <Button variant="primary" size="medium">
            판매자와 채팅
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SellerModal;
