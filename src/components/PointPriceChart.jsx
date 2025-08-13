import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPointPriceData } from '../data/mockData';
import Card from './Card';
import '../styles/components/PointPriceChart.css';

const PointPriceChart = () => {
  const pointPriceData = getPointPriceData();
  const priceChange = -1.0; // 24시간 변동률 (고정값)

  return (
    <Card variant="elevated" className="point-price-chart">
      <div className="chart-header">
        <h3>📈 10만 포인트 기준 현금 거래</h3>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={pointPriceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(0, 212, 255, 0.8)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="rgba(0, 212, 255, 0.1)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255, 255, 255, 0.6)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.6)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
                color: '#ffffff'
              }}
              formatter={(value, name) => [
                name === 'price' ? `₩${value.toLocaleString()}` : value.toLocaleString(),
                name === 'price' ? '가격' : name === 'volume' ? '거래량' : '변동률'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#00d4ff" 
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-summary">
        <div className="summary-item">
          <span className="summary-label">현재가</span>
          <span className="summary-value">₩{pointPriceData[pointPriceData.length - 1]?.price.toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">24시간 변동</span>
          <span className={`summary-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange}%
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PointPriceChart;
