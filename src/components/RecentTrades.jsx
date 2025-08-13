import { recentTradesData } from '../data/mockData';
import Button from './Button';
import Card from './Card';
import '../styles/components/RecentTrades.css';

const RecentTrades = () => {
  return (
    <Card variant="elevated" className="recent-trades-card">
      <div className="card-header">
        <h3>🔄 최근 거래 내역</h3>
        <Button variant="secondary" size="small">전체보기</Button>
      </div>
      <div className="recent-trades">
        {recentTradesData.map((trade) => (
          <div key={trade.id} className={`trade-item ${trade.type}`}>
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

export default RecentTrades;
